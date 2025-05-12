import { Redirect } from "expo-router"
import { useSelector } from "react-redux"

const UserAuth = (WrappedComponent)=>{
    return function UserAuth(){
        const user = useSelector(state=>state.auth.user) ?? null
        
        console.log("Current user: ", user)
        if(!user){
            return <Redirect href="/login" />
        }else{
            return <WrappedComponent/>
        }
    }
}

export default UserAuth