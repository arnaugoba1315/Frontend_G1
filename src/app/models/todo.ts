export class Todo {
    userId: string;
    id: string;
    title: string;
    completed: boolean;

    constructor(userId?: string, id?: string, title?: string, completed?: boolean) {
        this.userId = ( userId ? userId : "" );
        this.id = ( id ? id : "" );
        this.title = ( title ? title : "" );
        this.completed = ( completed ? completed : false );
    }   

    static generateMongoId(): string {
        // Timestamp en segundos (4 bytes)
        const timestamp = Math.floor(Date.now() / 1000).toString(16);
    
        // Generar una cadena aleatoria de 16 caracteres para simular los 8 bytes restantes
        const random = 'xxxxxxxxxxxxxxxx'.replace(/x/g, () => {
          return Math.floor(Math.random() * 16).toString(16);
        });
    
        // Concatenar el timestamp con la cadena aleatoria para formar un ObjectId de 24 caracteres
        return timestamp + random;
      }
}

  