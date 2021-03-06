import { Component, OnInit } from '@angular/core';
import { AngularFire } from 'angularfire2';
import { Checklist } from '../../shared/checklist';
import { ChecklistStatuses } from '../../shared/checklistStatuses';

@Component({
  selector: 'app-checklists-backoffice',
  templateUrl: 'checklists-backoffice.component.html',
  styleUrls: ['checklists-backoffice.component.css']
})
export class ChecklistsBackofficeComponent implements OnInit {

  checklists: Checklist[];

  constructor(private af: AngularFire) {
    this.af.auth.subscribe(authData => {
      if (authData) {
        this.af.database.list('checklists').subscribe((checklists) => {
          this.checklists = checklists;
        });
      }
    });
  }

  ngOnInit() {}

  getStatus(status: number) {
    return ChecklistStatuses[status];
  }
}
