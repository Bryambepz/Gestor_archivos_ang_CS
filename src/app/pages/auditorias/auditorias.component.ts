import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { lastValueFrom, Observable } from 'rxjs';
import { Desc_Proyecto } from 'src/app/domain/Desc_Proyecto';
import { Info_Proceso } from 'src/app/domain/Info_Proceso';
import { Proceso } from 'src/app/domain/Proceso';
import { Proyecto } from 'src/app/domain/Proyecto';
import { AuditoriasServiceService } from 'src/app/services/serv_aud/auditorias-service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-auditorias',
  templateUrl: './auditorias.component.html',
  styleUrls: ['./auditorias.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AuditoriasComponent implements OnInit {
  procesos_edit: string = '';

  proyecto: Proyecto = new Proyecto();
  proyectos: Proyecto[] = [];

  desc_proy: Desc_Proyecto = new Desc_Proyecto();
  desc_proyectos: Desc_Proyecto[] = [];

  proceso: Proceso = new Proceso();
  procesos: Proceso[] = [];

  info_proceso: Info_Proceso = new Info_Proceso();
  registros: Info_Proceso[] = [];

  proyectoSeleccionado: string = '';
  descripcionSeleccionado: string = '';
  registroSeleccionado: string = '';
  idregistroSeleccionado: number = 0;
  procesoSeleccionado: number = 0;
  cant_proceso: number = 0;
  estado: string = '';

  list_contenido: string[] = [];
  menu_cont: string[] = [];
  titulos:string[]=[];
  list_titulos:string[] = ['Oficio de Ingreso TDR',
                            'Terminos De Referencia',
                            'Aprobación Terminos de Referencia',
                            'Oficio de Ingreso de Auditoria',
                            'Informe Auditoria Ambiental',
                            'Oficio de Pronunciamiento favorable',
                            'Pago de Tasas',
                            'Solicitud de Aprobación AA',
                            'Aprobación Auditoria Ambiental',
                            'Notificación a Proponente'
                            ]

  id_editar: number = 0;
  tituloS:string = '';
  editarInfo:boolean = false;

  constructor(
    private servAuditorias: AuditoriasServiceService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    
    if (localStorage.getItem('ced_log') === '') {
      // this.router.navigate(['/login']);
      window.location.href = '/login';
    }
    
    this.route.queryParams.subscribe((d) => {
      this.estado = d['estado'];
    });

    this.listarProyectos();
    this.menu_cont.push('proyecto');
    this.list_contenido.push('id_proyecto');


    console.log('el estado >', this.estado);

    this.procesos_edit = localStorage.getItem('editar')!;
    localStorage.setItem('editar', '');
    this.tituloS = localStorage.getItem('tituloS')!;
    localStorage.setItem('tituloS', '');
    this.editarInfo = false;

    let datos = this.procesos_edit.split(',');
    
    let proy = [''];
    if (datos.length > 3) {      
      for (let i = 0; i < datos.length - 3; i++) {
        proy[0] = proy[0] + datos[i] + ',';
      }
      proy[0] = proy[0] + datos[datos.length - 3];
      proy.push(datos[datos.length - 2]);
      proy.push(datos[datos.length - 1]);
      datos = proy;
    }
    if(this.tituloS != ''){      
      datos.push(this.tituloS)
    }
    
    if (datos.length < 3 && this.estado != undefined) {
      this.router.navigate(['/control_auditoria']);
    } else {
      if (this.estado == 'editarTitulo') {
        this.servAuditorias.getProyectos().subscribe((data) => {
          data.forEach((f) => {
            if (f.nombre == datos[0]) {
              this.id_editar = f.id;
              this.proyecto = f;
            }
          });
        });
        var doc = document.getElementById('btnProyecto');
        doc!.innerHTML = 'Actualizar Proyecto';
        var doc = document.getElementById('tblProyecto');
        doc!.remove();
      } else if (this.estado == 'editarDescripcion') {
        this.clickTProyectos(datos[0].toString());
        this.servAuditorias.getDescByProyecto(datos[0]).subscribe((d) => {
          this.desc_proy = d[0];
          this.id_editar = this.desc_proy.id;
        });

        var doc = document.getElementById('btnDescripcion');
        doc!.innerHTML = 'Actualizar Descripción';
        var doc = document.getElementById('tblDescripcion');
        doc!.remove();
      } else if (this.estado == 'editarProceso') {
        this.clickTProyectos(datos[0].toString());
        this.clickTDescripcion(datos[1]);

        this.servAuditorias
          .getProcesoEditar(datos[0], datos[1], parseInt(datos[2]))
          .subscribe((d) => {
            
            this.proceso = d;
          });

        var doc = document.getElementById('btnProceso');
        doc!.innerHTML = 'Actualizar Proceso';
        var doc = document.getElementById('tblProceso');
        doc!.remove();
      }else if(this.estado == 'editarAdjuntos'){
        this.editarInfo = true;
        this.idregistroSeleccionado = parseInt(datos[2]);
        console.log(datos[0]);
        this.clickTProyectos(datos[0].toString());
        this.clickTDescripcion(datos[1]);
        this.clickTProceso(datos[1], parseInt(datos[2]))

        this.servAuditorias.getInformacionBy(datos[1], parseInt(datos[2])).subscribe((d) => {
          d.forEach((f) => {
            if(f.titulo == datos[3]){
              // console.log("la F > ", f);
              this.info_proceso = f
            }
          })
        })

        var doc = document.getElementById('btnInformacion');
        doc!.innerHTML = 'Actualizar Registro';
        var doc = document.getElementById('tblInfo');
        doc!.remove();
      }
      console.log("info edi>",this.editarInfo);
      
    }
  }

  listarProyectos() {
    this.servAuditorias.getProyectos().subscribe((d) => {
      this.proyectos = d.sort((a,b) => b.id-a.id);
    });
  }

  crearProyecto() {

    if (
      document.getElementById('btnProyecto')!.textContent == 'Crear Proyecto'
    ) {
      this.servAuditorias
        .crearProyecto(this.proyecto, localStorage.getItem('ced_log')!)
        .subscribe((data) => {
          this.listarProyectos();
        });
    } else {
      this.servAuditorias
        .actualizarProyecto(this.proyecto, this.id_editar)
        .subscribe((d) => {
          window.location.href = '/control_auditoria';
          // this.listarProyectos();
        });
    }
  }

  listarDescripciones() {
    this.servAuditorias
      .getDescByProyecto(this.proyectoSeleccionado)
      .subscribe((d) => {
        this.desc_proyectos = d;
      });
  }

  crearDescProy() {
    if (document.getElementById('btnDescripcion')!.textContent == 'Agregar Descripción') {
      if (this.proyectoSeleccionado != '') {
        this.servAuditorias
          .descripcionProyecto(this.desc_proy, this.proyectoSeleccionado)
          .subscribe((d) => {
            this.listarDescripciones();
          });
      }
    } else {
      this.servAuditorias
        .actualizarDescripcion(this.desc_proy, this.id_editar)
        .subscribe((d) => {
          window.location.href = '/control_auditoria';
        });
    }
  }

  listarProcesos() {
    this.servAuditorias
      .getProcesoBy(this.descripcionSeleccionado)
      .subscribe((d) => {
        if (d != null){
          this.procesos = d.sort((a, b) => a.proceso - b.proceso);
          this.cant_proceso = this.procesos.length + 1;
        }
      });
  }

  crearProceso() {
    if (
      this.proceso.estado_contrato != '' &&
      this.proceso.plan_acc != '' &&
      this.proceso.confirmacion_actual != ''
    ) {
      if (this.descripcionSeleccionado != '') {
        if (document.getElementById('btnProceso')!.textContent == 'Proceso') {
          this.proceso.proceso = this.cant_proceso;
          this.servAuditorias
            .crearProceso(this.descripcionSeleccionado, this.proceso)
            .subscribe((d) => {
              this.listarProcesos();
              this.proceso = new Proceso();
            });
        } else {
          this.servAuditorias
            .actualizarProceso(
              this.proceso,
              this.proyectoSeleccionado,
              this.descripcionSeleccionado,
              this.proceso.proceso
            )
            .subscribe((d) => {
              window.location.href = '/control_auditoria';
            });
        }
      }
    }
  }

  listarInformacion() {
    this.servAuditorias
      .getInformacionBy(this.descripcionSeleccionado, this.procesoSeleccionado)
      .subscribe((d) => {        
        this.registros = d.sort((a,b) => a.id-b.id);
        this.titulos = [];
        for (let i = 0; i < this.registros.length+1; i++) {
          this.titulos.push(this.list_titulos[i])
        }
        if(this.editarInfo == false){
          this.info_proceso.titulo = this.titulos[this.titulos.length-1];
          console.log("no edit", this.editarInfo);        
        }
        
        
      });
  }

  addInformacion() {
    if (
      this.registroSeleccionado != '' &&
      this.info_proceso.arch_adjunto != '' &&
      this.info_proceso.arch_adjunto != ''
    ) {
      Swal.fire({
        icon: 'warning',
        title: 'La documentación es la correcta',
        // text: 'Seguro que los datos estan correctos',
        confirmButtonText: 'Si',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#3a63a5',
        cancelButtonColor: 'rgb(221, 51, 51)',
      }).then((d) => {
        if (d.isConfirmed) {
          console.log(this.info_proceso);
          if (document.getElementById('btnInformacion')!.textContent == 'Agregar Registro') {
            this.servAuditorias
            .informacionProceso(
              this.info_proceso,
              this.procesoSeleccionado,
              this.descripcionSeleccionado
            )
            .subscribe((d) => {
              console.log('ccc = ', d);
              this.listarInformacion();
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'La documentación ha sido registrada',
                showConfirmButton: false,
                timer: 1500,
              });
            });
          }else{                        
            this.servAuditorias.actualizarInformacion(this.info_proceso, 3).subscribe((d) => {
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'La documentación ha sido actualizada',
                showConfirmButton: false,
                timer: 1500,
              });
              window.location.href = "/control_auditoria";           
            })
          }   
        }
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Ocurrio un problema, \nrevise que selecciono todos los datos necesarios',        
        showCloseButton: true,
        showConfirmButton: false,
        timer: 5500,        
      })
    }
  }

  clickTProyectos(titulo: string) {
    this.proyectoSeleccionado = titulo;
    this.listarDescripciones();
    if (!this.menu_cont.some((s) => s == 'Descripción Proyecto')) {
      this.menu_cont.push('Descripción Proyecto');
      this.list_contenido.push('id_descripcion');
    }
    this.accionDiv('id_descripcion');
  }

  clickTDescripcion(titulo: string) {
    this.descripcionSeleccionado = titulo;
    this.listarProcesos();
    if (!this.menu_cont.some((s) => s == 'Proceso')) {
      this.menu_cont.push('Proceso');
      this.list_contenido.push('id_proceso');
    }
    this.accionDiv('id_proceso');
  }

  clickTProceso(titulo: string, nproc: number) {
    this.registroSeleccionado = titulo;
    this.idregistroSeleccionado = nproc;
    this.procesoSeleccionado = nproc;
    this.listarInformacion();
    if (!this.menu_cont.some((s) => s == 'Información Procesos')) {
      this.menu_cont.push('Información Procesos');
      this.list_contenido.push('id_info');
    }
    this.accionDiv('id_info');
  }

  cargaArchivo(event: any, estado: string) {
    estado === 'inicial'
      ? (this.info_proceso.arch_adjunto = event.target.files[0].name)
      : (this.info_proceso.arch_adjunto = event.target.files[0].name);
  }

  accionDiv(id: string) {
    var contenido = document.getElementById(id);
    contenido!.style.display = '';
    try {
      var href = document.getElementsByClassName('link_' + id)[0];
      href!.classList.add('href');
    } catch (error) {}

    this.list_contenido.forEach((f) => {
      if (f !== id) {
        contenido = document.getElementById(f);
        contenido!.style.display = 'none';
        var href = document.getElementsByClassName('link_' + f)[0];

        if (href != undefined) {
          href!.classList.remove('href');
        }
      }
    });
  }
}
