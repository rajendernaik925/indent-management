import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

@NgModule({
  declarations: [
  ],
  imports: [
    FormsModule,
    CommonModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
  ],
})

export class SharedModule {}
