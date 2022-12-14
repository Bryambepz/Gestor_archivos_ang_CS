export class Proceso{
    proceso:number = 0;
    descripcion:string = "";
    confirmacion_actual: boolean = false;
    num_contrato:string = '';
    monto:number = 0;
    consultor:string = '';
    codigo_registro:string = '';
    fecha_ini:Date = new Date();
    fecha_fin:Date = new Date();
    plan_acc:boolean = false;
    estado_contrato:boolean = false;
    identificador:string = "";
}