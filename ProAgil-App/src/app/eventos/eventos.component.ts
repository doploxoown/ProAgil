import { Component, OnInit} from '@angular/core';
import { EventoService } from '../_services/evento.service';
import { Evento } from '../_models/Evento';
import { BsModalService } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { ptBrLocale } from 'ngx-bootstrap/locale';

defineLocale('pt-br', ptBrLocale);

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit {
  titulo = 'Eventos';
  eventosFiltrados: Evento[] = [];
  eventos: Evento[] = [];
  evento!: Evento;
  modoSalvar = 'post';
  dataEvento = '';
  imagemLargura = 50;
  imagemMargem = 2;
  mostrarImagem = false;
  registerForm!: FormGroup;
  bodyDeletarEvento = '';

  file!: File;
  fileNameToUpdate!: string;
  dataAtual!: string;
  
  _filtroLista: string = '';
  
  constructor(
    private eventoService: EventoService,
    private modalService: BsModalService,
    private fb: FormBuilder,
    private localeService: BsLocaleService,
    private toastr: ToastrService)
  {
    this.localeService.use('pt-br');
  }
  
  get filtroLista(): string {
    return this._filtroLista;
  }
  
  set filtroLista(value: string) {
    this._filtroLista = value;
    this.eventosFiltrados = this.filtroLista ? this.filtrarEventos(this.filtroLista) : this.eventos;
  }
  
  novoEvento(template: any){
    this.modoSalvar = 'post';
    this.openModal(template);
  }
  
  editarEvento(evento: Evento, template: any){
    this.modoSalvar = 'put';
    this.openModal(template);
    this.evento = Object.assign({}, evento);
    this.fileNameToUpdate = evento.imagemURL.toString();
    this.evento.imagemURL = '';
    this.registerForm.patchValue(this.evento);
  }
  
  excluirEvento(evento: Evento, confirm: any){
    confirm.show();
    this.evento = evento;
    this.bodyDeletarEvento = `Tem certeza que deseja excluir o Evento: ${evento.tema}, C??digo: ${evento.id}`;
  }
  
  confirmeDelete(confirm: any){
    this.eventoService.deleteEvento(this.evento.id).subscribe(() => {
      confirm.hide();
      this.getEventos();
      this.toastr.success('Evento deletado com successo!');
    }, error => {
      this.toastr.error(`Erro ao deletar: ${error}`);
    }
    );
  }

  onFileChange(event){
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      this.file = event.target.files;
    }
  }

  uploadImagem(){
    if (this.modoSalvar === 'post') {
      const nomeArquivo = this.evento.imagemURL.split('\\',3);
      this.evento.imagemURL = nomeArquivo[2];
      //const nomeArquivo = 'img' + (this.eventos[this.eventos.length - 1].id + 1) + '.jpg';
      //this.evento.imagemURL = nomeArquivo;
      //console.log(nomeArquivo);
      this.eventoService.postUpload(this.file, nomeArquivo[2])
      .subscribe(
        () => {
          this.dataAtual = new Date().getMilliseconds().toString();
          this.getEventos();
        }
      );
    }
    else{
      this.evento.imagemURL = this.fileNameToUpdate;
      this.eventoService.postUpload(this.file, this.fileNameToUpdate)
        .subscribe(
          () => {
            this.dataAtual = new Date().getMilliseconds().toString();
            this.getEventos();
          }
        );
    }
  }
  
  openModal(template: any) {
    this.registerForm.reset();
    this.registerForm.get('dataEvento')?.setValue(new Date());
    template.show();
  }
  
  ngOnInit() {
    this.validation();
    this.getEventos();
  }
  
  filtrarEventos(filtrarPor: string): Evento[] {
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.eventos.filter(
      evento => evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1
      || evento.local.toLocaleLowerCase().indexOf(filtrarPor) !== -1
      );
    }
    
    alterarImagem() {
      this.mostrarImagem = !this.mostrarImagem;
    }
    
    validation(){
      this.registerForm = this.fb.group({
        tema: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
        local: ['', Validators.required],
        dataEvento: ['', Validators.required],
        qtdPessoas: ['', [Validators.required, Validators.max(120000)]],
        telefone: ['', Validators.required],
        imagemURL: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
      });
    }
    
    salvarAlteracao(template: any){
      if(this.registerForm.valid){
        if (this.modoSalvar === 'post') {
          this.evento = Object.assign({}, this.registerForm.value);
          this.uploadImagem();
          this.eventoService.postEvento(this.evento).subscribe(
            (novoEvento: Evento) => {
              template.hide();
              this.getEventos();
              this.toastr.success('Evento salvo com successo!');
            }, error => {
              this.toastr.error(`Erro ao salvar evento: ${error}`);
            }
            );
          }
          else{
            this.evento = Object.assign({id: this.evento.id}, this.registerForm.value);
            this.uploadImagem();
            this.eventoService.putEvento(this.evento).subscribe(
              () => {
                template.hide();
                this.getEventos();
                this.toastr.success('Evento alterado com successo!');
              }, error => {
                this.toastr.error(`Erro ao editar evento: ${error}`);
              }
            );
          }
        }
      }
      
      getEventos() {
        this.eventoService.getAllEvento().subscribe(
          (_eventos: Evento[]) => {
            this.eventos = _eventos;
            this.eventosFiltrados = this.eventos;
          }, error => {
            this.toastr.error(`Erro ao listar eventos: ${error}`);
          });
        }      
      }
      