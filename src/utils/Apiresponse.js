class ApiResponse{
    constructor(message="success",statuscode,data,success){
        this.message=message;
        this.statuscode=statuscode;
        this.data=data;
        this.success=statuscode<400;
    }
}
export {ApiResponse}