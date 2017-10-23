import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {TestComponentComponent} from '../test-component/test-component.component';
import {TestListComponent} from '../test-list/test-list.component';
import {TestDetailComponent} from '../test-detail/test-detail.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: TestComponentComponent,
        children: [
          {
            path: '',
            component: TestListComponent
          },
          {
            path: ':id',
            component: TestDetailComponent
          }
        ]
      }
    ])
  ],
  declarations: [],
  exports: [RouterModule]
})
export class TestRoutingModule {
}
