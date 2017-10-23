import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TestRoutingModule} from './test-routing/test-routing.module';
import {TestComponentComponent} from './test-component/test-component.component';
import {TestDetailComponent} from './test-detail/test-detail.component';
import {TestListComponent} from './test-list/test-list.component';

@NgModule({
  imports: [
    CommonModule, TestRoutingModule
  ],
  declarations: [TestComponentComponent, TestDetailComponent, TestListComponent]
})
export class TestModuleModule {
}
