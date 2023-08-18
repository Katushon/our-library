import { Component, ComponentRef, ViewChild, ViewContainerRef, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { concatMap, mergeMap, toArray } from 'rxjs/operators';
import { from, of } from 'rxjs';

export type ResponceData = {
    path: string
}

@Component({
    selector: 'lib-dynamic-container',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './dynamic-container.component.html'
})

export class DynamicContainerComponent implements OnDestroy, OnInit {

    @Input() value!: ResponceData[];
    @ViewChild('containerRef', { read: ViewContainerRef }) containerRef: ViewContainerRef | undefined;
    componentRef!: ComponentRef<any> | undefined;

    constructor() {
        this.componentRef = undefined;
    }

    getAllComponents() {
        return of(this.value).pipe(
            mergeMap(items => {
                return from(items).pipe(
                    concatMap(async (item: ResponceData) => {
                        // This one works (but not when library used from separate app)
                        // const module = await import(`../../${item.path}/src/${item.path}.component`);

                        const module = await import(`@mycompany/sdk/${item.path}/src/${item.path}.component`);

                        const componentInfo = Object.values(module)
                            .map((exportedItem: any) => ({
                                class: exportedItem,
                                name: exportedItem.name
                            }))
                            .find((comp) => {
                                return comp.class?.prototype?.hasOwnProperty("constructor");
                            });

                        if (componentInfo) {
                            return {
                                path: item.path,
                                moduleName: componentInfo.name,
                                module
                            };
                        }
                        return null;
                    }),
                    toArray()
                )
            })
        );
    }

    createComponentsDynamically() {
        this.getAllComponents().subscribe((components)=> {
            components.forEach((component) => {
                if (!component?.moduleName || !component.module || !component.module[component.moduleName]) {
                    return;
                }
                this.componentRef = this.containerRef?.createComponent(component.module[component.moduleName]);
            })
        })
    }

    ngOnInit(): void {
        this.createComponentsDynamically();
    }

    ngOnDestroy() {
        this.componentRef = undefined;
    }
}
