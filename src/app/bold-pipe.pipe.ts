import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'boldPipe'
})
export class BoldPipePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    const boldVal = `<b>${value}</b>`;
      return boldVal;
  }

}
