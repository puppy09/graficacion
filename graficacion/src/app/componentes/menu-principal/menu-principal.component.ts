import { Component } from '@angular/core';
import * as go from 'gojs';
import jsPDF from "jspdf";
import html2canvas from 'html2canvas';
import { catchError, groupBy } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-menu-principal',
  standalone: true,
  imports: [],
  templateUrl: './menu-principal.component.html',
  styleUrl: './menu-principal.component.css'
})
export class MenuPrincipalComponent {
  
}
