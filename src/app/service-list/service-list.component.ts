import { Component, OnInit } from '@angular/core';
import {HttpService} from '../http/http.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-service-list',
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.scss']
})
export class ServiceListComponent implements OnInit {
  organization: any;
  userId: string;
  list: Array<any>;

  constructor(private httpService: HttpService, private router: Router) {
  }

  ngOnInit(): void {
    this.httpService.get('/organizations/' + localStorage.getItem('orgId')).subscribe(
      data => {
        this.organization = data;
      });
    this.userId = localStorage.getItem('id');
    this.httpService.getAll('/organizations/' + localStorage.getItem('orgId') + '/services', Number(localStorage.getItem('servPage'))).subscribe(
      data => {
        console.log(data);
        this.list = data.content;
      });
  }

  createReservation(id1: string) {
    this.httpService.post('/reservations', {
      comment: '',
      rating: -1,
      service: {
        id: id1
      },
      organization: {
        id: localStorage.getItem('orgId')
      }
    }).subscribe(data => {},
      error => {
        if (error.status === 200) {
          console.log(error);
          localStorage.setItem('servPage', '0');
          this.router.navigateByUrl('/organization');
        }
      });
  }

  delete(id: string) {
    console.log(id);
    this.httpService.delete('/service' + id).subscribe(
      data => {
        this.router.navigateByUrl('/organization');
      }
    );
  }

  changePage(page: number) {
    if (localStorage.getItem('page') === '0' && page === -1) {
      return;
    } else {
      localStorage.setItem('page', (Number(localStorage.getItem('page')) + page).toString());
    }
    this.ngOnInit();
  }

  navigate(id: string): void {
    localStorage.setItem('servId', id);
    this.router.navigateByUrl('/service');
  }

}
