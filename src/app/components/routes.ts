import { Route } from "@angular/router";
import { SearchComponent } from "./search/search.component";
import { UpdateCvComponent } from "./update-cv/update-cv.component";

export default [
  {
    path: 'search', component: SearchComponent
  },
  {
    path: 'update', component: UpdateCvComponent
  }
] as Route[];
