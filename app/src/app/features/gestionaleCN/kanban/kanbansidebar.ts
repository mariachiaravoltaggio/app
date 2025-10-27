import { Component, ElementRef, inject, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DrawerModule } from 'primeng/drawer';
import { PopoverModule } from 'primeng/popover';
import { TooltipModule } from 'primeng/tooltip';
import { CheckboxModule } from 'primeng/checkbox';
import { InplaceModule } from 'primeng/inplace';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ProgressBarModule } from 'primeng/progressbar';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { DatePickerModule } from 'primeng/datepicker';
import { Subscription } from 'rxjs';
import { StyleClassModule } from 'primeng/styleclass';
import { MemberService } from '@/features/service/member.service';
import { KanbanService } from './service/kanban.service';
import { ProfileList } from "../usermanagement/profile.list";
import { DialogService, DynamicDialogRef, DynamicDialogModule } from 'primeng/dynamicdialog';
import { ProfileCreate } from '../usermanagement/profile.create';
import { Kanban } from '.';
import { KanbanCardType, Task, ListName, Comment } from './kanban.model';
export interface Member {
    id?: number;
    name?: string;
    image?: string;
}

@Component({
    selector: 'kanban-sidebar',
    standalone: true,
    providers: [DialogService],
    imports: [
        CommonModule,
        FormsModule,
        DrawerModule,
        PopoverModule,
        TooltipModule,
        InplaceModule,
        AutoCompleteModule,
        ProgressBarModule,
        AvatarModule,
        CheckboxModule,
        InputTextModule,
        TextareaModule,
        ButtonModule,
        RippleModule,
        DatePickerModule,
        StyleClassModule,
        ProfileList,
        DynamicDialogModule
    ],
    template: ` @if (formValue) {
        <p-drawer #sidebar [(visible)]="parent.sidebarVisible" position="right" [baseZIndex]="10000" styleClass="w-full! lg:w-400! overflow-auto" [showCloseIcon]="false">
            <ng-template #headless>
                <form (submit)="onSave($event)">
                    <div class="px-6 py-12 border-b border-surface flex items-center justify-between h-16">
                        <p-inplace #inplace>
                            <ng-template #display>
                                <span class="text-surface-900 dark:text-surface-0 font-semibold text-lg" pTooltip="Click to edit">
                                    {{ formValue.title ? formValue.title : 'Untitled' }}
                                </span>
                            </ng-template>

                            <ng-template #content let-closeCallback="closeCallback">
                                <span class="inline-flex items-center gap-1 h-10">
                                    <input #inputTitle type="text" name="title" autofocus [(ngModel)]="formValue.title" pInputText class="h-full" (keydown.enter)="$event.preventDefault(); inplace.deactivate()" />

                                    <!-- IMPORTANTE: type="button" per non fare submit -->
                                    <button type="button" (click)="closeCallback($event)" pButton icon="pi pi-check" class="h-10"></button>
                                </span>
                            </ng-template>
                        </p-inplace>

                        <div class="flex relative">
                            <button pButton pRipple type="button" icon="pi pi-times" severity="secondary" rounded text (click)="close()"></button>
                        </div>
                    </div>

                    <div class="grid grid-cols-12 gap-4">
                        <div class="col-span-12 md:col-span-6 lg:col-span-6 space-y-8">
                            <div class="col-span-12 field px-8 flex flex-col gap-4 py-2">
                                <label for="start" class="block text-surface-900 dark:text-surface-0 font-semibold text-lg">Struttura</label>
                                <textarea id="description" name="description" type="text" pTextarea [rows]="1" [(ngModel)]="formValue.description" style="resize: none" class="w-full"></textarea>
                            </div>
                            <div class="col-span-12 px-8 flex gap-4">
                                <div class="flex flex-col field w-full gap-4">
                                    <label for="start" class="block text-surface-900 dark:text-surface-0 font-semibold text-lg">Data Inizio</label>
                                    <p-datepicker
                                        name="startDate"
                                        dateFormat="yy-mm-dd"
                                        [showTime]="false"
                                        [required]="true"
                                        [showIcon]="true"
                                        inputId="start"
                                        inputStyleClass="w-full text-surface-900 dark:text-surface-0 font-semibold"
                                        class="w-full"
                                        [(ngModel)]="formValue.startDate"
                                    ></p-datepicker>
                                </div>
                                <div class="flex flex-col field w-full gap-4">
                                    <label for="due" class="block text-surface-900 dark:text-surface-0 font-semibold text-lg">Data Fine</label>
                                    <p-datepicker
                                        name="endDate"
                                        dateFormat="yy-mm-dd"
                                        [showTime]="false"
                                        [required]="true"
                                        [showIcon]="true"
                                        inputId="due"
                                        inputStyleClass="w-full text-surface-900 dark:text-surface-0 font-semibold"
                                        class="w-full"
                                        [(ngModel)]="formValue.dueDate"
                                    ></p-datepicker>
                                </div>
                            </div>
                            @if (formValue.taskList.tasks.length || showTaskContainer) {
                                <div class="col-span-12 flex flex-col px-8">
                                    <div class="flex justify-between mb-4">
                                        <span class="text-surface-900 dark:text-surface-0 font-semibold text-lg">Progress</span>
                                        <span class="text-surface-900 dark:text-surface-0 font-semibold">{{ formValue.progress }}%</span>
                                    </div>
                                    <p-progress-bar name="progress" [value]="formValue.progress" [showValue]="false" styleClass="h-1!"></p-progress-bar>
                                </div>
                            }
                            @if (formValue.taskList.tasks.length || showTaskContainer) {
                                <div class="col-span-12 flex flex-col px-8">
                                    <label for="start" class="block text-surface-900 dark:text-surface-0 font-semibold text-lg">Promemoria</label>
                                    <textarea type="text" pTextarea name="taskContent" [(ngModel)]="taskContent" style="resize: none" class="w-full mt-6 mb-6" placeholder="Aggiungi un prommoria" (keydown.enter)="addTask($event)"></textarea>
                                    @if (formValue.taskList && formValue.taskList.tasks && formValue.taskList.tasks.length !== 0) {
                                        <ul class="list-none p-6 flex flex-col gap-4 bg-surface-50 dark:bg-surface-950 border-surface border rounded-border">
                                            @for (task of formValue.taskList.tasks; track task.text; let i = $index) {
                                                <li class="flex items-center gap-4">
                                                    <p-checkbox [name]="task.text + i" [(ngModel)]="task.completed" [binary]="true" [inputId]="task.text" (onChange)="calculateProgress()"></p-checkbox>
                                                    <span style="word-break: break-all;" [ngClass]="{ 'text-600 line-through': task.completed, 'text-900': !task.completed }">
                                                        {{ task.text }}
                                                    </span>
                                                </li>
                                            }
                                        </ul>
                                    }
                                </div>
                            }

                            <div class="col-span-12 flex flex-col gap-y-6 px-8 mb-12">
                                <span class="block text-surface-900 dark:text-surface-0 font-semibold text-lg">Note</span>
                                <div class="flex items-center">
                                    <textarea type="text" pTextarea name="comment" [(ngModel)]="comment" style="resize: none" class="w-full" placeholder="Scrivi una nota..." (keydown.enter)="onComment($event)"></textarea>
                                </div>
                            </div>
                        </div>
                        <div class="col-span-12 md:col-span-6 lg:col-span-6 mt-4">
                            <div class="col-span-12 flex flex-col field px-8">
                                <label for="assignees" class="block text-surface-900 dark:text-surface-0 font-semibold mb-4 text-lg">Catechisti</label>
                                <p-autocomplete
                                    [appendTo]="sidebar"
                                    name="assignees"
                                    [(ngModel)]="formValue.assignees"
                                    [suggestions]="filteredAssignees"
                                    (completeMethod)="filterAssignees($event)"
                                    field="name"
                                    [multiple]="true"
                                    [showEmptyMessage]="true"
                                    emptyMessage="No results found"
                                    placeholder="Choose assignees"
                                    [inputStyle]="{ height: '2.5rem' }"
                                    class="w-full"
                                    inputStyleClass="w-full"
                                >
                                    <ng-template let-assignee #selecteditem>
                                        <div class="flex items-center gap-2 border rounded-full dark:border-gray-600! p-2">
                                            <div class="flex gap-2 items-center">
                                                <span class="text-surface-900 dark:text-surface-0">{{ assignee.name }}</span>
                                            </div>
                                        </div>
                                    </ng-template>
                                    <ng-template let-assignee #item>
                                        <div class="flex items-center gap-2 rounded-border">
                                            <!--                                             <img src="/demo/images/avatar/{{ assignee.image }}" [alt]="assignee.name" class="h-8 w-8 border-2 rounded-full border-surface" /> -->
                                            <span class="text-surface-900 dark:text-surface-0">{{ assignee.name }}</span>
                                        </div>
                                    </ng-template>
                                </p-autocomplete>
                            </div>
                            <div class="col-span-12 flex flex-col field px-8 py-4">
                                <app-profile-list [isCreateConvivenza]="true" (addGuest)="openAddGuestDialog()">></app-profile-list>
                            </div>
                        </div>
                    </div>
                    <div class="flex w-full justify-end border-t border-surface py-8 px-8 gap-4">
                        <button pButton pRipple type="button" icon="pi pi-paperclip" class="p-button-outlined p-button-secondary border-surface text-surface-900 dark:text-surface-0 w-12 h-12"></button>
                        <button pButton pRipple type="button" icon="pi pi-trash" class="p-button-outlined p-button-secondary border-surface text-surface-900 dark:text-surface-0 w-12 h-12" (click)="onDelete()"></button>
                        <button pButton pRipple type="submit" icon="pi pi-check" label="Save" class="p-button-primary h-12"></button>
                    </div>
                </form>
            </ng-template>
        </p-drawer>
    }`,
    styles: `
        :host ::ng-deep {
            .p-drawer {
                .p-drawer-content {
                    padding: 0;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    height: 100%;
                    overflow: auto;
                }
            }
            .p-autocomplete {
                .p-autocomplete-chip-item {
                    display: flex;
                }
            }

            div.p-inplace-display {
                padding-left: 0 !important;
            }
        }
    `
})
export class KanbanSidebar implements OnDestroy {
    card: KanbanCardType = { id: '', taskList: { title: 'Untitled Task List', tasks: [] } };

    formValue!: KanbanCardType;

    listId: string = '';

    filteredAssignees: Member[] = [];

    assignees: Member[] = [];

    newComment: Comment = { id: '123', name: 'Jane Cooper', text: '' };

    newTask: Task = { text: '', completed: false };

    comment: string = '';

    taskContent: string = '';

    timeout: any = null;

    showTaskContainer: boolean = true;

    listNames: ListName[] = [];

    cardSubscription: Subscription;

    listSubscription: Subscription;

    listNameSubscription: Subscription;

    @ViewChild('inputTitle') inputTitle!: ElementRef;
    @ViewChild('inputTaskListTitle') inputTaskListTitle!: ElementRef;
    @ViewChild('sidebar', { read: ElementRef }) sidebarEl?: ElementRef<HTMLElement>;
    private dialogService = inject(DialogService);
    private dialogRef: DynamicDialogRef | null = null;
    constructor(
        public parent: Kanban,
        private memberService: MemberService,
        private kanbanService: KanbanService
    ) {
        this.memberService.getMembers().then((members) => (this.assignees = members));

        this.cardSubscription = this.kanbanService.selectedCard$.subscribe((data) => {
            this.card = data;
            this.formValue = { ...data };
        });
        this.listSubscription = this.kanbanService.selectedListId$.subscribe((data) => (this.listId = data));
        this.listNameSubscription = this.kanbanService.listNames$.subscribe((data) => (this.listNames = data));
    }

    ngOnDestroy() {
        this.dialogRef?.close();
        this.cardSubscription.unsubscribe();
        this.listSubscription.unsubscribe();
        this.listNameSubscription.unsubscribe();
        clearTimeout(this.timeout);
    }

    close() {
        this.parent.sidebarVisible = false;
        this.resetForm();
    }

    filterAssignees(event: any) {
        let filtered: Member[] = [];
        let query = event.query;

        for (let i = 0; i < this.assignees.length; i++) {
            let assignee = this.assignees[i];
            if (assignee.name && assignee.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
                filtered.push(assignee);
            }
        }

        this.filteredAssignees = filtered;
    }

    onComment(event: Event) {
        event.preventDefault();
        if (this.comment.trim().length > 0) {
            this.newComment = { ...this.newComment, text: this.comment };
            this.formValue?.comments?.unshift(this.newComment);
            this.comment = '';
        }
    }

    onSave(event: any) {
        event.preventDefault();
        this.card = { ...this.formValue };
        this.kanbanService.updateCard(this.card, this.listId);
        this.close();
    }

    onMove(listId: string) {
        this.kanbanService.moveCard(this.formValue, listId, this.listId);
    }

    onDelete() {
        this.kanbanService.deleteCard(this.formValue?.id || '', this.listId);
        this.parent.sidebarVisible = false;
        this.resetForm();
    }

    resetForm() {
        this.formValue = { id: '', taskList: { title: 'Untitled Task List', tasks: [] } };
    }

    addTaskList() {
        this.showTaskContainer = !this.showTaskContainer;

        if (!this.showTaskContainer) {
            return;
        } else if (!this.formValue.taskList) {
            let id = this.kanbanService.generateId();
            this.formValue = { ...this.formValue, taskList: { id: id, title: 'Untitled Task List', tasks: [] } };
        }
    }

    addTask(event: Event) {
        event.preventDefault();
        if (this.taskContent.trim().length > 0) {
            this.newTask = { text: this.taskContent, completed: false };
            this.formValue.taskList?.tasks.unshift(this.newTask);
            this.taskContent = '';
            this.calculateProgress();
        }
    }

    focus(arg: number) {
        if (arg == 1) {
            this.timeout = setTimeout(() => this.inputTitle.nativeElement.focus(), 1);
        }
        if (arg == 2) {
            this.timeout = setTimeout(() => this.inputTaskListTitle.nativeElement.focus(), 1);
        }
    }

    calculateProgress() {
        if (this.formValue.taskList) {
            let completed = this.formValue.taskList.tasks.filter((t) => t.completed).length;
            this.formValue.progress = Math.round(100 * (completed / this.formValue.taskList.tasks.length));
        }
    }
    openAddGuestDialog() {
        const appendTo = this.sidebarEl?.nativeElement ?? document.body;

        this.dialogRef = this.dialogService.open(ProfileCreate, {
            header: 'Aggiungi ospite',
            width: '50vw',
            modal: true,
            closable: true,
            dismissableMask: true,
            appendTo, // <-- dentro il drawer
            styleClass: 'max-h-[80vh] overflow-auto', // comodo su drawer
            inputValues: {
                initialData: {},
                title: 'Aggiungi Ospite'
            }
        });

        if (this.dialogRef) {
            this.dialogRef.onClose.subscribe((guest: any) => {
                if (!guest) return;
                // aggiorna la tua lista partecipanti/assignees come preferisci
                this.formValue.assignees = [...(this.formValue.assignees ?? []), guest];
                // eventualmente ricalcola progress, ecc.
            });
        }
    }
}
