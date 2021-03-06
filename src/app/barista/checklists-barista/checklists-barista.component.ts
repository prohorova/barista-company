import { Component, OnInit } from '@angular/core';
import { AngularFire } from 'angularfire2';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Checklist } from '../../shared/checklist';
import { ChecklistDay } from '../../shared/checklistDay';
import { ChecklistStatuses } from '../../shared/checklistStatuses';
import { UtilService } from '../../core/util.service';

@Component({
  selector: 'app-checklists-barista',
  templateUrl: 'checklists-barista.component.html',
  styleUrls: ['checklists-barista.component.css']
})
export class ChecklistsBaristaComponent implements OnInit {

  checklistForm: FormGroup;
  checklist: Checklist;
  checklists: Checklist[];
  userId: string;

  constructor(private fb: FormBuilder,
              private af: AngularFire,
              private router: Router,
              private utilService: UtilService) {
    this.af.auth.subscribe(authData => {
      if (authData) {
        this.userId = authData.uid;
        this.af.database.list('checklists', {query: {
          orderByChild: 'user',
          equalTo: this.userId
        }}).subscribe((checklists) => {
          this.checklists = checklists;
        });
      }
    });
  }

  ngOnInit() {
    this.checklistForm = this.fb.group({
      customer: ['', [Validators.required, Validators.minLength(5)]],
      date: ['', Validators.required]
    });
  }

  createChecklist(checklistForm) {
    let day = new ChecklistDay({date: checklistForm.date});
    let checklist = new Checklist({customer: checklistForm.customer, user: this.userId,  days: [day]});
    let checklistKey = this.af.database.list('checklists').push(checklist).key; // put data into firebase and get new object key
    this.router.navigate(['/barista/checklist', checklistKey]);
  }

  getDateFormat() {
    return this.utilService.getDatepickerFormat();
  }

  getStatus(status: number) {
    return ChecklistStatuses[status];
  }
}
