import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BoldPipePipe} from './pipes/bold-pipe.pipe';
import {NgxPaginationModule} from 'ngx-pagination';
import {PaginationComponent} from './shared-components/pagination/pagination.component';
import {AppServiceService} from './shared-services/app-service.service';
import { ProgressHudComponent } from './shared-components/progress-hud/progress-hud.component';

@NgModule({
  imports: [
    CommonModule, NgxPaginationModule
  ],
  declarations: [BoldPipePipe, PaginationComponent, ProgressHudComponent],
  exports: [BoldPipePipe, PaginationComponent, ProgressHudComponent],
  providers: [AppServiceService]
})
export class UtilityModule {
}
