import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { ProfileList } from "./usermanagement/profile.list";

@Component({
    selector: 'app-crea-convivenza',
    imports: [CommonModule, ProfileList],
    template: ` <app-profile-list [isCreateConvivenza]="true"></app-profile-list> `
})
export class CreaConvivenza {
}