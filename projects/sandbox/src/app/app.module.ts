import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';


// these imports work good, both of them
import { DynamicContainerComponent } from '../../../mycompany/sdk/dynamic-container';
import { TextInputComponent } from '../../../mycompany/sdk/text-input';

// this import works as well as it doesn't have lazy loading inside
// import { TextInputComponent } from '@mycompany/sdk/text-input';

// this import does not work
// import { DynamicContainerComponent } from '@mycompany/sdk/dynamic-container';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    DynamicContainerComponent,
    TextInputComponent,
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
