import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-test-list',
  templateUrl: './test-list.component.html',
  styleUrls: ['./test-list.component.css']
})
export class TestListComponent implements OnInit {

  constructor(private router:Router) { }

  private tasks = [
    {id: '1', title: 'Code Cleanup'},
    {id: '2', title: 'Review Code'},
    {id: '3', title: 'Build to Prod'}
  ];
  private errorMessage:any = '';

  onSelect(task) {
    this.router.navigate(['/test', task.id]);
  }

  ngOnInit() {
  }

}
