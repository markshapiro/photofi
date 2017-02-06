import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Popup from 'react-popup';

require('./style.less');

/* actions */
import * as actionCreators from 'actions/auth';

@connect(
  state => state.auth,
  dispatch => bindActionCreators(actionCreators, dispatch)
)
export class LogIn extends Component {
  constructor(props){
    super(props);
    this.state={
      intent: null,
      name: "",
      email: "",
      password: ""
    };
  }

  render() {
    return (
        <div className="logIn">
          {this.state.intent &&
            <div className="topLeft" onClick={()=>this.setState({intent: this.state.intent==='signin'?'signup':'signin' })}>
              <i className="ion-chevron-left" /> <span className="lightGrey">{this.state.intent==='signin'?'Sign Up':'Sign In'}</span>
            </div>}
          {!this.state.intent
          ?<div>
              <img className="centered logo" src={require('./photofiFull.jpg')} />
          </div>
          :<div>
            <img className="centered logo2" src={require('./photofi.jpg')} />
            <div className="txtCentered ultraThin title">{this.state.intent==='signup'?'Sign Up':'Sign In'}</div>
            <div className="input">
              <input type="text" placeholder="user name" value={this.state.name} onChange={e=>this.setState({name:e.target.value})}/>
              <i className="ion-ios-person-outline"></i> </div>
            {this.state.intent==='signup' &&
              <div className="input">
                <input type="text" placeholder="E-mail" value={this.state.email} onChange={e=>this.setState({email:e.target.value})}/>
                <i className="ion-ios-email-outline"></i> </div>}
            <div className="input">
              <input type="text" placeholder="Password" value={this.state.password} onChange={e=>this.setState({password:e.target.value})}/>
              <i className="ion-ios-locked-outline"></i> </div>
          </div>}

          <div className="lower">
            {!this.state.intent && <div className="txtCentered UltraThin wlcm ">Welcome!</div>}
            <button className={"button "+(this.state.intent && 'raise')} onClick={()=>{
            !this.state.intent
              ?this.setState({intent:'signup'})
              :this.signup()}}>{!this.state.intent?'+ Sign Up':'Submit'}</button>
            {!this.state.intent && <button className={"button fbBtn "+(this.state.intent && 'raise')} onClick={()=>this.fblogin()}>
              <i className="ion-social-facebook" />&nbsp;&nbsp;<span className="lbl">Facebook Login</span>
            </button>}
            {!this.state.intent &&
              <div className="txtCentered signInLbl Regular" onClick={()=>this.setState({intent:'signin'})}>
                <span className="lightGrey">Already have an account?</span>&nbsp;
                <span className="darkGrey">Sign in!</span>
              </div>}
          </div>
        </div>
    )
  }

  fblogin(){

    /*
    facebookConnectPlugin.login([], ({authResponse})=>{
      this.props.login({fbid:authResponse.userID, accessToken:authResponse.accessToken});
    }, ()=>{
      facebookConnectPlugin.logout(()=>{
        this.fblogin();
      });
    });*/

    return this.props.fblogin({
      "fbid":"1079454755514036",
      "accessToken":"aEAADq66AfGH0BAGxi4ZBgDcMmst04FGErOpXEHukZBDcdDlnMtzsC0sK24xlZBzJWZAWiJH4gh6uHZAzy9A8pk1cC7MHxKYGn67HFpdZAZBUZCOKsCeEBVqo93UpJKeTSIo0isBIltUS77Nrsnmtjj2J6Arpbkb1ZCEqFlmZBOIxflin8wBlj9zehNVcjsqZAaso6E8vrZC3VkZCB6juKqmwjpm3Xo"
    });
  }

  signup(){
    if(this.state.intent==='signin'){
      this.props.login({name: this.state.name, password: this.state.password});
    }
    if(this.state.intent==='signup'){
      this.props.register({name: this.state.name, email: this.state.email, password: this.state.password});
    }
  }
}
