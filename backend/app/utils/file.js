const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const mime = require("mime-types");
const MIMEType = require("whatwg-mimetype");
const deasync = require("deasync");
const util = require("util");
const parseDataURL = require("data-urls");
const ValidationError = require("./errors/validation-error");


const pathPrefix = path.resolve(`${__dirname}/../../database/${process.env.DB_FOLDER ?? ""}`);
const pathPattern = /^(?:[A-Z]:[\/\\]|\/?)(?:[^\/\\:<>"|?*]+?[\/\\])*\.?[^\/\\:<>"|?*]+?(?:\.\w+)?$/;

function readFile(filepath) {
    if (!filepath || !fs.existsSync(filepath = `${pathPrefix}/assets/${filepath}`) || !fs.lstatSync(filepath).isFile()) return null;
    const mime_type = mime.lookup(filepath);
    const content = fs.readFileSync(filepath);
    return `data:${mime_type};base64,${content.toString("base64")}`;
}

function validateAndNormaliseFile(base64url, expectedMime = undefined) {
    if (!base64url) return [];
    const dataUrl = parseDataURL(base64url);
    if (!dataUrl) return [];
    let mimeType = dataUrl.mimeType;
    if (expectedMime && !mimeType.essence.match(expectedMime)) throw new ValidationError(`Incorrect file mime: ${mimeType.essence}`, null);
    let data = Buffer.from(dataUrl.body, "base64");
    if (mimeType.type === "image") {
        data = deasync(util.callbackify(() => sharp(data)
            .resize(1024, 1024, { fit: "inside", withoutEnlargement: mimeType.essence !== "image/svg+xml" })
            .toFormat("webp")
            .toBuffer()))();
        mimeType = new MIMEType("image/webp");
    }
    return [data, mimeType];
}

function storeFile(filepath, data, mimeType) {
    if (!filepath || !data || !mimeType) return undefined;
    filepath = `${pathPrefix}/assets/${filepath}.${mime.extension(mimeType.essence)}`;
    fs.mkdirSync(path.dirname(filepath), { recursive: true });
    fs.writeFileSync(filepath, data);
    return path.relative(`${pathPrefix}/assets`, filepath).replace(/\\/g, "/");
}

function deleteFile(filepath) {
    if (!filepath) return;
    filepath = `${pathPrefix}/assets/${filepath}`;
    const dir = path.dirname(filepath);
    if (!fs.existsSync(dir)) return;
    if (fs.existsSync(filepath)) fs.rmSync(filepath);
    rmWhileEmpty(dir);

    function rmWhileEmpty(directory) {
        fs.rmdir(directory, err => {
            if (!err) rmWhileEmpty(path.dirname(directory));
            // If it failed, the directory is probably not empty, so do nothing
        });
    }
}

module.exports = { pathPattern, pathPrefix, readFile, validateAndNormaliseFile, storeFile, deleteFile };