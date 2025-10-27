import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { Subscription } from 'rxjs';
import { KanbanSidebar } from './kanbansidebar';
import { KanbanList } from './kanbanlist';
import { KanbanService } from './service/kanban.service';
import { ProgressBarModule } from 'primeng/progressbar';
import { KanbanListType, KanbanCardType } from './kanban.model';
import { AppMap } from '../../../shared/map/app.map';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'kanban',
    standalone: true,
    imports: [CommonModule, CheckboxModule, FormsModule, KanbanSidebar, AppMap, ProgressBarModule, KanbanList, CommonModule, ButtonModule, RippleModule, DragDropModule],
    template: `
        <div class="grid grid-cols-12 gap-6">
            <!-- SINISTRA: liste Kanban -->
            <div class="col-span-12 lg:col-span-4">
                <div class="flex gap-8 w-full flex-col md:flex-row flex-nowrap lg:overflow-y-hidden overflow-x-auto">
                    <kanban-list [list]="list" [listIds]="listIds" class="p-kanban-list"></kanban-list>
                    <kanban-sidebar></kanban-sidebar>
                </div>
            </div>

            <!-- DESTRA: Riepilogo card selezionata -->
            <aside class="col-span-12 lg:col-span-8 lg:sticky lg:top-4">
                <ng-container *ngIf="selectedCard as card; else emptyPreview">
                    <div class="card p-4 space-y-3 border border-surface rounded-border">
                        <div class="flex justify-between items-center">
                            <span class="text-surface-900 dark:text-surface-0 font-semibold">{{ card.title ? card.title : 'Untitled' }}</span>
                        </div>
                        <div style="word-break: break-word" class="text-surface-700 dark:text-surface-100"><i class="pi pi-users text-surface-700 dark:text-surface-100 mr-2"></i> <strong>Partecipanti: </strong>{{ card.attachments }}</div>
                        @if (card.startDate && card.dueDate) {
                            <div style="word-break: break-word" class="text-surface-700 dark:text-surface-100">
                                <i class="pi pi-clock text-surface-700 dark:text-surface-100 mr-2"></i><strong>Durata: </strong>Data Inizio {{ card.startDate | date: 'dd-MM-yy' }} - DataFine: {{ card.startDate | date: 'dd-MM-yy' }}
                            </div>
                        }
                        @if (card.description) {
                            <div style="word-break: break-word" class="text-surface-700 dark:text-surface-100"><i class="pi pi-map-marker text-surface-700 dark:text-surface-100 mr-2"></i><strong>Luogo: </strong>{{ card.description }}</div>
                            <app-map [coords]="[41.72889, 12.65827]" [zoom]="17" [tooltip]="'Via Rufelli 14,<br/>00041 Albano Laziale RM'"></app-map>
                        }
                        @if (card.taskList && card.taskList.tasks.length) {
                            <div class="col-span-12 flex flex-col mt-4">
                                <label for="start" class="block text-surface-900 dark:text-surface-0 font-semibold text-lg mb-2">Promemoria da completare</label>
                                @if (card.taskList && card.taskList.tasks && card.taskList.tasks.length !== 0) {
                                    <ul class="list-none p-6 flex flex-col gap-4 bg-surface-50 dark:bg-surface-950 border-surface border rounded-border">
                                        @for (task of card.taskList.tasks; track task.text; let i = $index) {
                                            <li class="flex items-center gap-4">
                                                <p-checkbox [name]="task.text + i" [(ngModel)]="task.completed" [binary]="true" [inputId]="task.text"></p-checkbox>
                                                <span style="word-break: break-all;" [ngClass]="{ 'text-600 line-through': task.completed, 'text-900': !task.completed }">
                                                    {{ task.text }}
                                                </span>
                                            </li>
                                        }
                                    </ul>
                                }
                            </div>
                        }
                    </div>
                </ng-container>

                <ng-template #emptyPreview>
                    <div class="card p-4 text-sm text-color-secondary">Nessuna card selezionata.</div>
                </ng-template>
            </aside>
        </div>
    `,
    /*     styles: `
        :host {
            ::-webkit-scrollbar {
                height: 6px;
            }

            ::-webkit-scrollbar-track {
                background: transparent;
            }

            ::-webkit-scrollbar-thumb {
                background-color: var(--gray-500);
                border-radius: 20px;
            }
        }

        :host ::ng-deep {
            .p-button-label {
                flex: 0;
                white-space: nowrap;
            }

            .p-inplace {
                .p-inplace-content {
                    .p-inputtext {
                        border-top-right-radius: 0;
                        border-bottom-right-radius: 0;
                    }

                    .p-button {
                        border-top-left-radius: 0px;
                        border-bottom-left-radius: 0px;
                        width: 3rem;
                        height: 3rem;
                    }
                }

                .p-inplace-display {
                    padding: 0;
                }
            }
        }

        .p-kanban-list {
            cursor: pointer;
            height: min-content;
        }

        .cdk-drag-preview {
            box-sizing: border-box;
            border-radius: 4px;
            box-shadow:
                0 5px 5px -3px rgba(0, 0, 0, 0.2),
                0 8px 10px 1px rgba(0, 0, 0, 0.14),
                0 3px 14px 2px rgba(0, 0, 0, 0.12);
        }

        .cdk-drag-placeholder {
            opacity: 0.25;
        }

        .cdk-drag-animating {
            transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
        }
    `, */
    providers: [KanbanService]
})
export class Kanban implements OnInit, OnDestroy {
    sidebarVisible: boolean = false;

    list: KanbanListType = { listId: '', cards: [] };

    listIds: string[] = [];
    selectedCard: KanbanCardType | null = null;
    subscription = new Subscription();
    taskContent: string = '';
    constructor(private readonly kanbanService: KanbanService) {
        this.subscription = this.kanbanService.lists$.subscribe((data) => {
            this.list = data[0];
            this.listIds = data.map((l) => l.listId || '');
            if (!this.selectedCard || !this.cardExists(this.selectedCard)) {
                const first = this.getFirstAvailableCard();
                if (first) {
                    this.kanbanService.onCardSelect(first, this.list.listId);
                } else {
                    //  this.kanbanService.onCardSelect(null,null);
                }
            }
        });
        this.subscription.add(
            this.kanbanService.selectedCard$.subscribe((card) => {
                this.selectedCard = card;
            })
        );
    }

    ngOnInit() {
        const first = this.getFirstAvailableCard();
        if (first) this.kanbanService.onCardSelect(first, this.list.listId);
    }

    toggleSidebar() {
        this.sidebarVisible = true;
    }

    addList() {
        this.kanbanService.addList();
    }

    dropList(event: CdkDragDrop<KanbanListType[]>) {
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    }
    private cardExists(card: KanbanCardType): boolean {
        if (!card) return false;
        else return true;
    }

    private getFirstAvailableCard(): KanbanCardType | null {
        if (this.list) {
            return this.list.cards[0];
        }
        return null;
    }
    parseDate(dueDate: string) {
        return new Date(dueDate).toDateString().split(' ').slice(1, 3).join(' ');
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
