import {Component, Input, OnInit, VERSION} from '@angular/core';

@Component({
  selector: 'app-codeeditor',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.css']
})
export class CodeEditorComponent implements OnInit {
  name = 'Angular ' + VERSION.major;
  @Input() injectedCode = "";
  @Input() editable = true;

  codeMirrorOptions: any = {
    mode: "text/x-java",
    indentWithTabs: true,
    smartIndent: true,
    lineNumbers: true,
    lineWrapping: false,
    extraKeys: { "Ctrl-Space": "autocomplete" },
    gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
    autoCloseBrackets: true,
    matchBrackets: true,
    lint: true,
    theme: "dracula",
    styleSelectedText: true,
  };


  ngOnInit() {
    if (!this.editable){
        this.codeMirrorOptions['readOnly'] = 'nocursor';
    }
  }

  setEditorContent(event: Event) {
    // console.log(event, typeof event);
    //console.log(this.query);
  }

}
