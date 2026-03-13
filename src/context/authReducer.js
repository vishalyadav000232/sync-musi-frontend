

export const authReducer = ( state , action)=>{
    switch(action.type){
        case "AUTH_LOADING":
            return {
                ...state,
                loading : true
            }
        case "LOGIN_SUCCESS":
            return{
                ...state,
                loading : false,
                user : action.payload,
                isAuthenticated : true
            }
        case "LOGOUT":
       return {
        user: null,
        isAuthenticated: false,
        loading: false
      };
      default:
        return state
    }
}