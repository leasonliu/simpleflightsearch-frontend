import { Component, OnInit } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker/public_api';
import { setTheme } from "ngx-bootstrap/utils";

import * as moment from "moment";
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-mainpage',
  templateUrl: './mainpage.component.html',
  styleUrls: ['./mainpage.component.css']
})
export class MainpageComponent implements OnInit {

  bsValue = new Date();
  bsConfig: Partial<BsDatepickerConfig>;
  colorTheme = "theme-blue";
  ///////
  from = "";
  to = "";
  flightNumber = "";
  err = "";
  ///////
  displayedColumns = ["flightNumber", "carrier", "origin", "departure", "destination", "arrival", "aircraft", "distance", "travelTime", "status"];
  resultFlights = [];
  ifReturned = false;

  constructor(private httpClient: HttpClient) {
    setTheme("bs4"); // or 'bs3'
    this.bsConfig = Object.assign({}, { containerClass: this.colorTheme });
    this.bsValue.setDate(this.bsValue.getDate() + 2);
  }

  ngOnInit() {
  }

  onSubmit() {
    // console.log(this.from, this.to, this.flightNumber, this.transformDateToString(this.bsValue));
    if (this.flightNumber.trim() !== "") {
      this.err = "";
      let data = { flightNumber: this.flightNumber, date: this.transformDateToString(this.bsValue) };
      this.httpClient.post("http://localhost:8080/", data).subscribe((res: any[]) => {
        this.flightNumber = "";
        this.resultFlights = res;
        this.ifReturned = true;
      });
    } else if (this.from.trim() !== "" && this.to.trim() !== "") {
      this.err = "";
      let data = { from: this.from, to: this.to, date: this.transformDateToString(this.bsValue) };
      this.httpClient.post("http://localhost:8080/", data).subscribe((res: any[]) => {
        this.from = "";
        this.to = "";
        this.resultFlights = res;
        this.ifReturned = true;
      });
    } else {
      this.err = "Please specify (Origin & Destination) or (Flight Number)";
    }
  }

  transformDateToString(date: Date): string {
    return moment(date).format("YYYY-MM-DD");
  }
}
