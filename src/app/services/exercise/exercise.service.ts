import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../environments/environment.prod";
import {ElectronService} from "ngx-electron";
import {Repository} from "../../model/repository/repository.model";

@Injectable({
  providedIn: 'root'
})
export class ExerciseService {

  constructor(private http: HttpClient, private _electronService: ElectronService) { }


  // LOCAL CALLS
  getFilesFromRemote(githubUrl: string, branchName: string){
    let repo = new Repository(branchName, githubUrl)
    this._electronService.ipcRenderer.send("getFilesFromRemote", repo)
  }

  initProductionCodeFromLocal(exercise: string){
    this._electronService.ipcRenderer.send('getProductionClassFromLocal',exercise);
  }

  initTestingCodeFromLocal(exercise: string){
    this._electronService.ipcRenderer.send('getTestingClassFromLocal',exercise);
  }

  initConfigCodeFromLocal(exercise: string){
    this._electronService.ipcRenderer.send('getConfigFilesFromLocal',exercise);
  }

  // END LOCAL CALLS


  // CLOUD CALLS

  getExercises(){
    return this.http.get<any>(environment.exerciseServiceUrl + '/files/')
    }

  getMainClass(exercise: string){
    let HTTPOptions:Object = {
      headers: new HttpHeaders({
          'Content-Type': 'application/json'
      }),
      responseType: 'text'
   }
   return this.http.get<string>(environment.exerciseServiceUrl + '/files/' + exercise + "/Production", HTTPOptions);
  }

  getTestClass(exercise: string){
    let HTTPOptions:Object = {
      headers: new HttpHeaders({
          'Content-Type': 'application/json'
      }),
      responseType: 'text'
   }
   return this.http.get<string>(environment.exerciseServiceUrl + '/files/' + exercise + "/Test", HTTPOptions);

  }
  getConfigFile(exercise: string) {
    let HTTPOptions:Object = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      responseType: 'json'
    }
    return this.http.get<any>(environment.exerciseServiceUrl + '/files/' + exercise + "/Configuration", HTTPOptions);
  }

  // END CALLS

}
