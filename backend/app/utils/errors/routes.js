function manageAllErrors(res, err) {
    let resBuilder = res.status((err.code || err.status) ?? 500);
    if (err.extra) resBuilder.json(err.extra);
    else if (err.message || err.stack) resBuilder.json({message: err.message, stack_trace: err.stack.split("\n").map(line => line.replace(/^\s+/g, ""))});
    else resBuilder.end();
}

function catchErrors(req, res, fct) {
    try {
        fct();
    } catch (err) {
        manageAllErrors(res, err);
    }
}

module.exports = {manageAllErrors, catchErrors};