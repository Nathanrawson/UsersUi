import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

export interface Config {

}

@Injectable()
export class ConfigService {
  constructor(private http: HttpClient) {

  }
}