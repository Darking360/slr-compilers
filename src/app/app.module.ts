import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { RuleComponent } from './gramatic/rule/rule.component';
import { ClosingComponent } from './gramatic/closing/closing.component';

@NgModule({
  declarations: [
    AppComponent,
    RuleComponent,
    ClosingComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
