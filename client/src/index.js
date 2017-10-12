import React from 'react';
import ReactDOM from 'react-dom';
import {Alert,Navbar,Nav,NavItem,PageHeader,Form,FormGroup,FormControl,ControlLabel,HelpBlock,Button,Label,Panel,Grid,Row,Col,Image,Thumbnail} from 'react-bootstrap';
import luke from './lukeBig.jpg';
import loading from './loading.jpg';

function Navigator(props) {
    return (
        <Navbar collapseOnSelect>
        <Navbar.Header>
        <Navbar.Brand>
        freshwatersurf
        </Navbar.Brand>
        <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
        <Nav pullRight>
        <NavItem onClick={props.switchGrid}>Home</NavItem>
        <NavItem onClick={props.switchContact}>Contact</NavItem>
        <NavItem onClick={props.switchSignin}>Sign In</NavItem>
        </Nav>
        </Navbar.Collapse>
        </Navbar>
    );
}

class SpotGrid extends React.Component {
    constructor () {
        super();
        this.state = {
            isLoading: true,
            cfs: [null,null,null],
        }
    }
    /* 
    componentDidMount() {
        const urls = ['https://waterservices.usgs.gov/nwis/iv/?site=13206000&format=json,1.1','https://waterservices.usgs.gov/nwis/iv/?site=13337000&format=json,1.1','https://waterservices.usgs.gov/nwis/iv/?site=13022500&format=json,1.1'];
    //const urls = ['http://localhost:8000/api','http://localhost:8000/api','http://localhost:8000/api'];
        const myInit = { method: 'GET',
        };
        return urls.map((url,index) => {
            fetch(url,myInit)
                .then((response) => response.json())
                .then((responseJson) => {
                    const newCfs = this.state.cfs;
                    newCfs[index] = responseJson['value']['timeSeries'][0]['values'][0]['value'][0]['value'];
                    this.setState({isLoading: false,cfs: newCfs});
                    //console.log(this.state.cfs);
                })
                .catch((error) => {
                    console.error(error);
                });
        });
    }
    */


                    render() {
                        const spots = ['Boise Whitewater Park','Bend Greenwave','Lochsa Pipeline'];
                        const cfs = this.state.cfs;
                        if (this.state.isLoading) {
                            return (<Image src={loading} responsive />);
                        }
                        else {
                            return (
                                <Grid>
                                <Row>
                                <Col xs={6} md={4}>
                                <SessionSquare sampleImage={luke}
                                surfSpot={spots[0]} cfs={cfs[0]+' cfs'}
                                />
                                </Col>
                                <Col xs={6} md={4}>
                                <SessionSquare sampleImage={luke}
                                surfSpot={spots[1]} cfs={cfs[1]+' cfs'}
                                />
                                </Col>
                                <Col xs={6} md={4}>
                                <SessionSquare sampleImage={luke}
                                surfSpot={spots[2]} cfs={cfs[2]+' cfs'}
                                />
                                </Col> 
                                </Row>
                                </Grid>
                            );
                        }
                    }
}

function SessionSquare(props) {
    return (
        <Thumbnail src={props.sampleImage}>
        <h3>{props.surfSpot}</h3>
        <p>{props.cfs}</p>
        </Thumbnail>
    );
}

class Contact extends React.Component {
    constructor() {
        super();
        this.state = {
            posts: [{username: 'lbosse', content: 'this is a test'},{username: 'gbraiser', content: 'this is also a test'}],
        }
    }

    render() {
        let posts = this.state.posts;
        const postList = posts.map((post) => {
            return (
                <Panel header={post.username}>
                {post.content}
                </Panel>
            );
        });
        return (
            <div className="contactContainer">
            <div className="postsContainer">
            {postList}
            </div>
            <SuggestionForm/>
            </div>
        );
    }
}

class SuggestionForm extends React.Component {
    constructor() {
        super();
        this.state = {
            content: '',
        }
        this.handleChange = this.handleChange.bind(this);
    }

    isValidSubmission() {
        const length = this.state.content.length;
        if (length > 0) { 
            return true;
        }
        else {
            return false;
        }
    }

    generateSubmitButton() {
        if (this.isValidSubmission()) {
            return (
                <Button bsStyle="primary">
                Submit
                </Button>
            );
        }
        else {
            <Button bsStyle="primary" disabled>
                Submit
                </Button>
        }
    }

    handleChange(event) {
        this.setState({ content: event.target.value });
    }

    render() {
        const submitButton = this.generateSubmitButton();
        return (
            <Form>
            <FormGroup
            controlId="formControlsTextArea"
            >
            <ControlLabel>Suggestions? Questions? Tell us here!</ControlLabel>
            <FormControl
            componentClass="textarea"
            value={this.state.content}
            placeholder="Enter text"
            onChange={this.handleChange}
            />
            </FormGroup>
            {submitButton}
            </Form>
        );
    }
}

class SigninForm extends React.Component {
    constructor() {
        super();
        this.state = {
            username: '',
            password: '',
            message: '',
        }
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({ [name]: value, message : '' });
    }

    isValidUsername() {
        const username = this.state.username;
        let unameMsgOne = 'That username is already taken!';
        let unameMsgTwo = "Oops, looks like you don't have an account!";
        let usernameRegex = /^([A-Z0-9_\-]{5,30})$/i;
        if (usernameRegex.test(username)&&this.state.message!=unameMsgOne&&this.state.message!=unameMsgTwo) {
            return 'success';
        }
        else {
            return 'error';
        }
    }

    isValidPassword() {
        const password = this.state.password;
        let pwordMsg = 'That was the wrong password!';
        let passwordRegex = /^([A-Z0-9@*#!_]{8,15})$/i;
        if (passwordRegex.test(password)&&this.state.message!=pwordMsg) {
            return 'success';
        }
        else {
            return 'error';
        }
    }

    isValidSubmission() {
        let userPass = this.isValidUsername();
        let passwdPass = this.isValidPassword();
        if (userPass=='success'&&passwdPass=='success') {
            return true;
        }
        else {
            return false;
        }
    }

    generateSubmitButton() {
        if (this.isValidSubmission()) {
            return (
                <Button bsStyle="primary" type="submit">
                Submit
                </Button>
            );
        }
        else {
            <Button bsStyle="primary" type="submit" disabled>
                Submit
                </Button>
        }
    }

    generateMessage() {
        if (this.state.message != '') {
            return (
                <Alert bsStyle="danger">
                {this.state.message}
                </Alert>
            );
        }
        else {
            return (
                <span></span>
            );
        }
    }
}

class CreateAccountForm extends SigninForm {
    constructor() {
        super();
        this.handleSigninSubmit = this.handleSigninSubmit.bind(this);
    }

    handleSigninSubmit(submit) {
        console.log('called submit handler');
        var myInit = {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: this.state.username,
                password: this.state.password,
            }),
        };
        fetch('/signup',myInit).then((response) => {
            console.log('response status: '+response.statusText);
            return response.json();
        }).then((data) => {
            console.log(data);
            if (data.authenticated === true) {
                this.props.login(this.state.username,this.state.password);
                this.props.switchGrid();
            }
            else {
                if (data.message != '') {
                    this.setState({message: data.message});
                }
                else {
                    this.setState({message: 'Something went wrong!!'});
                }
            }
        });
        submit.preventDefault();
    }

    render() {
        let submitButton = this.generateSubmitButton();
        let messagePanel = this.generateMessage();
        return (
            <div className="signinFormContainer">
            <div className="formHeader">
            <PageHeader>Create an account:</PageHeader>
            </div>
            <Form onSubmit={this.handleSigninSubmit} horizontal>
            <FormGroup 
            controlId="formHorizontalUsername"
            validationState={this.isValidUsername()}
            >
            <Col componentClass={ControlLabel} sm={2}>
            Username
            </Col>
            <Col sm={10}>
            <FormControl 
            name="username"
            type="username" 
            placeholder="Username" 
            onChange={this.handleChange}
            />
            <HelpBlock>
            Username must be between 5 and 30 characters in length and may only contain a-z,A-Z,0-9,- and _.
            </HelpBlock>
            </Col>
            </FormGroup>

            <FormGroup 
            controlId="formHorizontalPassword"
            validationState={this.isValidPassword()}
            >
            <Col componentClass={ControlLabel} sm={2}>
            Password
            </Col>
            <Col sm={10}>
            <FormControl 
            name="password"
            type="password" 
            placeholder="Password" 
            onChange={this.handleChange}
            />
            <HelpBlock>
            Password must be between 8 and 15 characters in length and may only contain a-z,A-Z,0-9,@,*,#,!, and _.
            </HelpBlock>
            </Col>
            </FormGroup>

            <FormGroup>
            <Col smOffset={2} sm={10}>
            {submitButton}
            </Col>
            </FormGroup>
            {messagePanel}
            </Form>
            </div>
        );
    }
}

class LoginForm extends SigninForm {
    constructor() {
        super();
        this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
    }

    handleLoginSubmit(submit) {
        var myInit = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: this.state.username,
                password: this.state.password,
            }),
        };
        fetch('/login',myInit).then((response) => {
            console.log('response status: '+response.statusText);
            return response.json();
        }).then((data) => {
            console.log(data);
            if (data.authenticated === true) {
                console.log('data authenticated "if" entered');
                console.log('form username: '+this.state.username);
                console.log('form password: '+this.state.password);
                let username = this.state.username;
                let password = this.state.password;
                this.props.login(username,password);
                this.props.switchGrid();
            }
            else {
                if (data.message != '') {
                    this.setState({message: data.message});
                }
                else {
                    this.setState({message: 'Something went wrong!!'});
                }
            }
        });
        submit.preventDefault(); 
    }

    render() {
        let submitButton = this.generateSubmitButton();
        let messagePanel = this.generateMessage();
        return (
            <div className="signinFormContainer">
            <div className="formHeader">
            <PageHeader>Already have an account? Login here:</PageHeader>
            </div>
            <Form onSubmit={this.handleLoginSubmit} horizontal>
            <FormGroup 
            controlId="formHorizontalUsername"
            validationState={this.isValidUsername()} 
            >
            <Col componentClass={ControlLabel} sm={2}>
            Username 
            </Col>
            <Col sm={10}>
            <FormControl 
            name="username"
            type="username" 
            placeholder="username" 
            onChange={this.handleChange}
            />
            <HelpBlock>
            Username must be between 5 and 30 characters in length and may only contain a-z,A-Z,0-9,- and _.
            </HelpBlock>
            </Col>
            </FormGroup>

            <FormGroup 
            controlId="formHorizontalPassword"
            validationState={this.isValidPassword()}
            >
            <Col componentClass={ControlLabel} sm={2}>
            Password
            </Col>
            <Col sm={10}>
            <FormControl 
            name="password"
            type="password" 
            placeholder="Password" 
            onChange={this.handleChange}
            />
            <HelpBlock>
            Password must be between 8 and 15 characters in length and may only contain a-z,A-Z,0-9,@,*,#,!, and _.
            </HelpBlock>
            </Col>
            </FormGroup>

            <FormGroup>
            <Col smOffset={2} sm={10}>
            {submitButton}
            </Col>
            </FormGroup>
            {messagePanel}
            </Form>
            </div>
        );
    }
}

function PleaseLogIn(props) {
    return (
        <PageHeader>
        Please <a onClick={props.switchSignIn}>Log In</a>
        </PageHeader>
    );
}

function AppError() {
    return (
        <PageHeader>
        <Label bsStyle="danger">Oops, something went wrong!!</Label>
        </PageHeader>
    );
}

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            username: '',
            password: '',
            currentView: 'grid',
        }
        this.login = this.login.bind(this);
    }

    login(myUsername,myPassword) {
        console.log('login called!');
        console.log('username: '+myUsername);
        console.log('password: '+myPassword);
        this.setState({username: myUsername, password: myPassword});
        return this;
    }

    switchGrid() {
        this.setState({currentView: 'grid',});
    }

    switchContact() {
        this.setState({currentView: 'contact',});
    }

    switchSignin() {
        this.setState({currentView: 'signin',});
    }

    render() {
        const authenticated = this.state.authenticated;
        const view = this.state.currentView;
        switch (view) {
            case 'grid':
                return (
                    <div className="appContainer">
                    <Navigator
                    switchGrid={() => this.switchGrid()}
                    switchContact={() => this.switchContact()}
                    switchSignin={() => this.switchSignin()}
                    />
                    <SpotGrid/>
                    </div>
                );
                break;
            case 'contact':
                if (this.state.username!='') {
                return (
                    <div className="appContainer">
                    <Navigator
                    switchGrid={() => this.switchGrid()}
                    switchContact={() => this.switchContact()}
                    switchSignin={() => this.switchSignin()}
                    />
                    <Contact/>
                    </div>
                );
                }
                else {
                return (
                    <div className="appContainer">
                    <Navigator
                    switchGrid={() => this.switchGrid()}
                    switchContact={() => this.switchContact()}
                    switchSignin={() => this.switchSignin()}
                    />
                    <PleaseLogIn switchSignIn={() => this.switchSignin()}/>
                    </div>
                );
                }
                break;
            case 'signin':
                return (
                    <div className="appContainer">
                    <Navigator
                    switchGrid={() => this.switchGrid()}
                    switchContact={() => this.switchContact()}
                    switchSignin={() => this.switchSignin()}
                    />
                    <div className="signinFormContainer">
                    <CreateAccountForm 
                    switchGrid={() => this.switchGrid()}
                    login={this.login}
                    />
                    <LoginForm 
                    switchGrid={() => this.switchGrid()}
                    login={this.login}
                    />
                    </div>
                    </div>
                );
                break;
            default: 
                return (
                    <div className="appContainer">
                    <Navigator
                    switchGrid={() => this.switchGrid()}
                    switchContact={() => this.switchContact()}
                    switchSignin={() => this.switchSignin()}
                    />
                    <AppError/>
                    </div>
                );
                break;
        }
    }
}

//========================================================

ReactDOM.render(<App />, document.getElementById('root'));
