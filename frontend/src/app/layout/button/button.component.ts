import {Component, Input} from "@angular/core";

@Component({
  selector: "app-button",
  templateUrl: "./button.component.html",
  styleUrls: ["./button.component.scss"]
})
export class ButtonComponent {
  @Input() color: string = "white";
  @Input() padding: boolean = true;
  @Input() disabled: boolean = false;
  @Input() visiblyDisabled: boolean = true;
  @Input() scale: boolean = true;

  constructor() {
  }
}
