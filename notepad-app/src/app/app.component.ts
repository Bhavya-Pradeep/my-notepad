import { Component, Inject } from '@angular/core';
import { NotesService } from './notes.service';
import { NewNote, Note, isNote } from './note';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  selected?: Note|NewNote;
  noteFormFlag = false;
  note:any;
  selectedId = null;
  noteForm = new FormGroup({
    noteTitle: new FormControl('', [Validators.required]),
    formBody: new FormControl(''),
    formFavorite: new FormControl(''),
    formColor: new FormControl('')
  });
  saveClicked = false;
  createdNewNote = false;
  creatingNewNOte = false;
  constructor(private readonly notesService: NotesService, ) {
    this.notesService.notes$.subscribe((data) => {
      this.note = data;
    });
  }

  selectNote(note: Note) {
    // TODO: prevent changing original object
    this.noteFormFlag = true;
    this.selected = note;
    this.selectedId = note?.id;
    this.noteForm.setValue({noteTitle: this.selected?.title, formBody:this.selected?.body, formFavorite: this.selected?.favorite, formColor: this.selected?.color});
  }

  newNote() {
    this.selectedId = null;
    this.saveClicked = false;
    this.noteForm?.controls?.noteTitle?.setErrors(null);

    this.noteFormFlag = true;
    this.selected = createNewNote();
    this.noteForm.reset();
    this.noteForm.setValue({ noteTitle: this.selected?.title, formBody:this.selected?.body, formFavorite: this.selected?.favorite, formColor: this.selected?.color});
    this.noteForm?.updateValueAndValidity();
  }

  saveNote(note: Note|NewNote) {
    // TODO: save note
    this.saveClicked = true;
    this.creatingNewNOte = !this.selectedId;
    
    if(!this.noteForm?.controls?.noteTitle?.errors?.required){
      this.noteFormFlag = false;
      this.notesService.saveNote({...note, id: this.selectedId || null}).subscribe((data) => {
        this.createdNewNote = this.creatingNewNOte;
      });
    }
    
  }
}

function createNewNote(): NewNote {
  return {title: '', body: '', color: '', favorite: false};
}
