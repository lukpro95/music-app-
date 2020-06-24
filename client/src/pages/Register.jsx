import React, {Component} from 'react';
import {Main, Title, Input, InfoPop} from '../components'
import api from '../api'

class Register extends Component {

    constructor(props) {
        super(props)

        this.state = {
            user_name: '',
            user_password: '',
            re_user_password: '',
            user_email: '',
            errors: [],
            success: [],
            isLoading: false,
            submitting: false,
        }
    }

    validate = () => {
        return new Promise ( async(resolve, reject) => {
            let errors = []
            if(!this.state.user_name) {errors.push("You must provide a Username.")} else {
                if(this.state.user_name.length < 4) {errors.push("Username has to be at least 4 characters long.")}
                const {user_name} = this.state
                await api.doesUserExist({user_name})
                .then((response) => {console.log(response.data); if(response.data === true) {errors.push("This username is already taken.")}})
            }
            if(!this.state.user_password) {errors.push("You must provide a Password.")} else {
                if(this.state.user_password.length < 8) {errors.push("Password has to be at least 8 characters long.")}
                if(this.state.user_password.length > 40) {errors.push("Password cannot exceed 40 characters.")}
            }
            if(!this.state.re_user_password) {errors.push("You must repeat a chosen Password.")} else {
                if(this.state.re_user_password !== this.state.user_password) {errors.push("Provided Passwords don't match.")}
            }
            if(!this.state.user_email) {errors.push("You must provide a valid Email.")} else {
                const {user_email} = this.state
                await api.doesEmailExist({user_email})
                .then((response) => {if(response.data) {errors.push("This email is already in use.")}})
            }

            let success = []
            if(!errors.length) {
                this.setState({success: success, errors: errors}, () => {
                    resolve()
                })
            } else {
                this.setState({success: success, errors: errors}, () => {
                    reject()
                })
            }
        })
    }
    
    switchPop = () => {
        console.log(this.state.isLoading)
        this.state.isLoading ? this.setState({isLoading: false}) : this.setState({isLoading: true})
    }

    onSubmit = async (e) => {
        e.preventDefault()

        this.setState({submitting: true, isLoading: true})

        await this.validate()
        .then(async () => {
            const {user_name, user_password, user_email} = this.state
            await api.register({user_name, user_password, user_email})
            .then((response) => {
                this.setState({success: [...this.state.success, "Successfully registered! We will redirect you in few seconds.."]})
                setTimeout(() => {
                    window.location.href = `/home`
                }, 2000)
            })
            .catch((err) => {
                console.log(err)
            })

            this.setState({submitting: false})
        })
        .catch(() => {
            this.setState({submitting: false})
        })

    }

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    render() {
        return (
            <Main>
                <div className="w-100">
                    <div className="item py-3">
                        <Title title={"Registration"} />
                        <div className="mx-5 my-2 w-100 d-flex justify-content-center">
                            <form onSubmit={this.onSubmit} className="w-100" action="">
                                <Input 
                                        mandatory title={"Username"} name={"user_name"} type={"text"} value={this.state.user_name || ""}
                                        onChange={this.onChange} focus/>

                                <Input 
                                        mandatory title={"Password"} name={"user_password"} type={"password"} value={this.state.user_password || ""}
                                        onChange={this.onChange}/>

                                <Input 
                                        mandatory title={"Re-enter Password"} name={"re_user_password"} type={"password"} value={this.state.re_user_password || ""}
                                        onChange={this.onChange}/>
                                
                                <Input 
                                        mandatory title={"Email"} name={"user_email"} type={"email"} value={this.state.user_email || ""}
                                        onChange={this.onChange}/>

                                <div className="d-flex mx-2 my-4 w-50 mx-auto">
                                    <button type="submit" className="w-100">Register Now</button>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
                
                {this.state.isLoading   ? <InfoPop 
                                                errors={this.state.errors} success={this.state.success} 
                                                submitting={this.state.submitting} switch={this.switchPop}/> 
                                            : 
                                            <span></span>}
            </Main>

        )
    }
}

export default Register;