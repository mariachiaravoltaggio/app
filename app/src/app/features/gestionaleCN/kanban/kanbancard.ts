import { Component, Input, OnDestroy, output } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';
import { ProgressBarModule } from 'primeng/progressbar';
import { CdkDragHandle } from '@angular/cdk/drag-drop';
import { KanbanService } from './service/kanban.service';
import { KanbanCardType } from './kanban.model';

@Component({
    selector: 'kanban-card',
    standalone: true,
    imports: [CommonModule, TieredMenuModule, ButtonModule, RippleModule, AvatarModule, ProgressBarModule, AvatarGroupModule, CdkDragHandle],
    template: `<div
        [id]="card.id"
        cdkDragHandle (click)="onSelect()"
        class="flex bg-surface-0 dark:bg-surface-900 flex-col w-full border border-surface p-4 gap-2 hover:bg-surface-50 dark:hover:bg-surface-950 cursor-pointer rounded-border"
        cdkDragHandle
    >
        <div class="flex justify-between items-center">
            <span class="text-surface-900 dark:text-surface-0 font-semibold">{{ card.title ? card.title : 'Untitled' }}</span>
            <div>
                <button pButton pRipple type="button" icon="pi pi-pencil" rounded text severity="info" class="p-trigger" (click)="onEdit($event)"></button>
                <button pButton pRipple type="button" icon="pi pi-cog" rounded text severity="secondary" class="p-trigger" (click)="onCog($event, menu)"></button>
                <p-tiered-menu #menu [model]="menuItems" appendTo="body" [popup]="true"></p-tiered-menu>
            </div>
        </div>
        @if (card.description) {
            <div style="word-break: break-word" class="text-surface-700 dark:text-surface-100"><i class="pi pi-map-marker text-surface-700 dark:text-surface-100 mr-2"></i>{{ card.description }}</div>
        }
        <div class="flex items-center justify-between flex-col md:flex-row gap-6 md:gap-0">
            @if (card.assignees && card.assignees.length > 0) {
                <span class="text-surface-900 dark:text-surface-0 font-semibold"><i class="pi pi-users text-surface-700 dark:text-surface-100 mr-2"></i>{{ card.attachments }}</span>
            }
            @if (card.dueDate) {
                <span class="text-surface-900 dark:text-surface-0 font-semibold"><i class="pi pi-clock text-surface-700 dark:text-surface-100 mr-2"></i>{{ parseDate(card.dueDate) }}</span>
            }
        </div>
    </div>`
})
export class KanbanCard implements OnDestroy {
    @Input() card!: KanbanCardType;

    @Input() listId!: string;
    // OUTPUT NUOVI
    select = output<KanbanCardType>();
    edit = output<KanbanCardType>();
    menuItems: MenuItem[] = [];

    subscription: Subscription;

    constructor(private readonly kanbanService: KanbanService) {
    this.subscription = this.kanbanService.lists$.subscribe(() => {});
    }

    parseDate(dueDate: string) {
        return new Date(dueDate).toDateString().split(' ').slice(1, 3).join(' ');
    }

    onDelete() {
        this.kanbanService.deleteCard(this.card.id, this.listId);
    }

    onCopy() {
        this.kanbanService.copyCard(this.card, this.listId);
    }

    onMove(listId: string) {
        this.kanbanService.moveCard(this.card, listId, this.listId);
    }

    generateMenu(subMenu: any[]) {
        this.menuItems = [
            { label: 'Copia', command: () => this.onCopy() },
            { label: 'Elimina', command: () => this.onDelete() }
        ];
    }

    generateTaskInfo() {
        let total = this.card.taskList.tasks.length;
        let completed = this.card.taskList.tasks.filter((t) => t.completed).length;
        return `${completed} / ${total}`;
    }
    onCog(e: Event, menu: any) {
        e.stopPropagation();
        menu.toggle(e);
    }
    onSelect() {
        this.select.emit(this.card);
    }

    onEdit(e: Event) {
        e.stopPropagation();
        this.edit.emit(this.card);
    }
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
