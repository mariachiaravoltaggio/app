import { Component, input, model, Optional, output, signal } from '@angular/core';
import { Select } from 'primeng/select';
import { InputText } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { CheckboxModule } from 'primeng/checkbox';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'user-create',
    standalone: true,
    imports: [CommonModule, FormsModule, Select, InputText, TextareaModule, ButtonModule, RippleModule, CheckboxModule],
    template: `<div class="card">
        <span class="text-surface-900 dark:text-surface-0 text-xl font-bold mb-6 block">{{ title() }}</span>
        <form (ngSubmit)="onSave($event)" class="grid grid-cols-12 gap-4">
            <div class="col-span-12 lg:col-span-12">
                <div class="grid grid-cols-12 gap-4">
                    <div class="mb-6 col-span-6">
                        <label for="name" class="font-medium text-surface-900 dark:text-surface-0 mb-2 block"> Nome </label>
                        <input id="name" type="text" pInputText fluid />
                    </div>
                    <div class="mb-6 col-span-6">
                        <label for="surname" class="font-medium text-surface-900 dark:text-surface-0 mb-2 block"> Cognome </label>
                        <input id="surname" type="text" pInputText fluid />
                    </div>
                    <div class="mb-6 col-span-12 md:col-span-12">
                        <label for="email" class="font-medium text-surface-900 dark:text-surface-0 mb-2 block"> Email </label>
                        <input id="email" type="text" pInputText fluid />
                    </div>
                    <div class="mb-6 col-span-12 md:col-span-6">
                        <label for="address" class="font-medium text-surface-900 dark:text-surface-0 mb-2 block">Indirizzo</label>
                        <input id="address" type="text" pInputText fluid />
                    </div>
                    <div class="mb-6 col-span-12 md:col-span-6">
                        <label for="city" class="font-medium text-surface-900 dark:text-surface-0 mb-2 block"> Citta' </label>
                        <input id="city" type="text" pInputText fluid />
                    </div>
                    <div class="mb-6 col-span-12 md:col-span-6">
                        <label for="role" class="font-medium text-surface-900 dark:text-surface-0 mb-2 block"> Ruolo </label>
                        <p-select inputId="role" [options]="roles" optionLabel="name" fluid [filter]="true" filterBy="name" [showClear]="true" placeholder="Seleziona ruolo">
                            <ng-template let-country #item>
                                <div class="flex items-center">
                                    <div>{{ country.name }}</div>
                                </div>
                            </ng-template>
                        </p-select>
                    </div>
                    <div class="mb-6 col-span-12 md:col-span-6">
                        <label class="font-medium text-surface-900 dark:text-surface-0 mt-2 mb-2 block">Disabilita'</label>
                        <div class="flex items-center gap-2">
                            <p-checkbox inputId="verified" name="verified" [(ngModel)]="model.verified" [binary]="true"> </p-checkbox>
                            <label for="verified">E' presente una disabilita'</label>
                        </div>
                    </div>
                    <div class="col-span-12 flex gap-2 justify-end">
                        <button pButton type="button" class="p-button-outlined" label="Annulla" (click)="onCancel()"></button>
                        <button pButton type="submit" class="p-button-primary" label="Create Profilo" icon="pi pi-check"></button>
                    </div>
                </div>
            </div>
        </form>
    </div> `
})
export class ProfileCreate {
    title = signal('Crea Profilo');
    initialData = input<{ nickname?: string; bio?: string; email?: string; country?: any; city?: string; state?: string; website?: string }>();
    // opzionale: evento se usi il componente embedded senza dialog
    saved = output<any>();
    roles: any[] = [];
    model = {
        name: '',
        surname: '',
        email: '',
        role: 'Nessuno',
        city: '',
        address: '',
        verified: false
    };
    constructor(
        @Optional() public ref?: DynamicDialogRef,
        @Optional() public config?: DynamicDialogConfig
    ) {
        const data = this.config?.data;
        if (data) {
            this.title.set(this.config?.data?.initialData.title);
            this.model = { ...this.model, ...this.config?.data?.initialData };
        } else {
            this.model = { ...this.model, ...this.initialData };
        }
    }
    ngOnInit() {
        this.roles = [
            { name: 'Ostiario', code: 'ostiario' },
            { name: 'Prete', code: 'prete' },
            { name: 'Catechista', code: 'catechista' },
            { name: 'Ospite', code: 'ospite' },
            { name: 'Nessuno', code: 'nessuno' },
            { name: 'Cantore', code: 'cantore' },
            { name: 'Aiuto ostiario', code: 'aiutostiario' }
        ];
    }

    onSave(e: Event) {
        e.preventDefault();
        const result = { ...this.model };

        // caso 1: siamo in un DynamicDialog ⇒ chiudi restituendo i dati
        if (this.ref) {
            this.ref.close(result);
            return;
        }

        // caso 2: usato via router ⇒ emetti evento o naviga
        this.saved.emit(result);
        // esempio di navigazione dopo salvataggio:
        // this.router.navigate(['/profili']);
    }

    onCancel() {
        if (this.ref) this.ref.close(null);
        // via router: puoi navigare indietro, se vuoi
        // else this.router.navigate(['../']);
    }
}
