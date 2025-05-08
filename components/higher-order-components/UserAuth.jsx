import { Redirect } from "expo-router"
import { useSelector } from "react-redux"

const UserAuth = (WrappedComponent)=>{
    return function UserAuth(){
        const user = useSelector(state=>state.auth.user) ?? null
        
        if(!user){
            return <Redirect href="/loginpage" />
        }else{
            return <WrappedComponent/>
        }
    }
}

export default UserAuth