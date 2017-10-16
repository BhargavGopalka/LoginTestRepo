import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BoldPipePipe} from './pipes/bold-pipe.pipe';
import {NgxPaginationModule} from 'ngx-pagination';
import {PaginationComponent} from './shared-components/pagination/pagination.component';
import {AppServiceService} from './shared-services/app-service.service';

@NgModule({
  imports: [
    CommonModule, NgxPaginationModule
  ],
  declarations: [BoldPipePipe, PaginationComponent],
  exports: [BoldPipePipe, PaginationComponent],
  providers: [AppServiceService]
})
export class UtilityModule {
}
