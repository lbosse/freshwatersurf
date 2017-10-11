import React from 'react';
import ReactDOM from 'react-dom';
import {Navbar,Nav,NavItem,Modal,Form,FormGroup,FormControl,ControlLabel,HelpBlock,Button,Label,Panel,Grid,Row,Col,Image,Thumbnail} from 'react-bootstrap';
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
            <Button bsStyle="primary" disabled="true">
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
        }
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({ [name]: value });
    }

    isValidUsername() {
        const username = this.state.username;
        let usernameRegex = /^([A-Z0-9_\-]{5,30})$/i;
        if (usernameRegex.test(username)) {
            return 'success';
        }
        else {
            return 'error';
        }
    }

    isValidPassword() {
        const password = this.state.password;
        let passwordRegex = /^([A-Z0-9@*#!_]{8,15})$/i;
        if (passwordRegex.test(password)) {
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
        fetch('/signup',myInit).then((res) => {
            console.log(res.username);
        });
        submit.preventDefault();
    }

    render() {
        let submitButton = this.generateSubmitButton();
        return (
            <div className="signinFormContainer">
            <div className="formHeader">
            <h1>Create an account:</h1>
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
        fetch('/login',myInit).then((req) => {
            console.log(req.user);
        });
        submit.preventDefault(); 
    }

    render() {
        let submitButton = this.generateSubmitButton();
        return (
            <div className="signinFormContainer">
            <div className="formHeader">
            <h1>Already have an account? Login here:</h1>
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
            </Form>
            </div>
        );
    }
}

function AppError() {
    return (
        <h1>
        <Label bsStyle="danger">Oops, something went wrong!!</Label>
        </h1>
    );
}

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            username: null,
            password: null,
            currentView: 'grid',
        }
    }

    login(myUsername,myPassword) {
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
                    <CreateAccountForm login={() => this.login()}/>
                    <LoginForm login={() => this.login()}/>
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
