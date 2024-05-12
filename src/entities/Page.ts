

export class ProcessWithPages {

    readonly size: number;
    readonly pagesNeeded: number;

    constructor(
       public processUuid: string,
    ){
        this.size = Math.floor(Math.random() * (26 - 6 + 1)) + 6;
        let paginasCompletas = Math.floor(this.size / 5);
  
        const tamanoUltimaPagina = this.size % 5;
        
        if (tamanoUltimaPagina > 0) {
          paginasCompletas++;
        }
        
        this.pagesNeeded = paginasCompletas;
    }
}