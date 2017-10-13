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
        <NavItem 
        onClick={props.switchGrid}><span className={props.homeActive}> Home
        </span>
        </NavItem>
        <NavItem 
        onClick={props.switchContact}>Contact</NavItem>
        <NavItem 
        onClick={props.switchSignin}>Sign In</NavItem>
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
            weather: [null,null,null],
            temp: [null,null,null],
        }
    }

    componentDidMount() {
        this.fetchCfs();
        this.fetchWeather()
    }

    fetchCfs() {
        const urls = ['https://waterservices.usgs.gov/nwis/iv/?site=13206000&format=json,1.1','https://waterservices.usgs.gov/nwis/iv/?site=13337000&format=json,1.1','https://waterservices.usgs.gov/nwis/iv/?site=13022500&format=json,1.1'];
        const myInit = { method: 'GET',
        };
        return urls.map((url,index) => {
            fetch(url,myInit)
                .then((response) => response.json())
                .then((responseJson) => {
                    const newCfs = this.state.cfs;
                    newCfs[index] = responseJson['value']['timeSeries'][0]['values'][0]['value'][0]['value'];
                    this.setState({cfs: newCfs});
                    //console.log(this.state.cfs);
                })
                .catch((error) => {
                    console.error(error);
                });
        });
    }

    fetchWeather() {
        const urls = ['https://api.openweathermap.org/data/2.5/weather?id=5586437&APPID=d70d2ea5c94b82c4047361fe3aee43d7','https://api.openweathermap.org/data/2.5/weather?id=5599665&APPID=d70d2ea5c94b82c4047361fe3aee43d7','https://api.openweathermap.org/data/2.5/weather?id=5828648&APPID=d70d2ea5c94b82c4047361fe3aee43d7'];
        const myInit = { method: 'GET',
        };
        return urls.map((url,index) => {
            fetch(url,myInit)
                .then((response) => response.json())
                .then((responseJson) => {
                    const newWeather = this.state.weather;
                    const newTemp = this.state.temp;
                    newWeather[index] = responseJson['weather'][0]['description'];
                    newTemp[index] += responseJson['main']['temp'];
                    this.setState({isLoading: false,weather: newWeather});
                    //console.log(this.state.cfs);
                })
                .catch((error) => {
                    console.error(error);
                });
        });
    }

    kToF(temp) {
        return Math.round(((Number(temp) - 273.15) * 1.8) + 32);
    }

    render() {
        const spots = ['Boise Whitewater Park','Lochsa Pipeline','Lunchcounter'];
        const cfs = this.state.cfs;
        const weather = this.state.weather;
        const temp = this.state.temp;
        if (this.state.isLoading) {
            return (<Image src={loading} responsive />);
        }
        else {
            return (
                <Grid>
                <Row>
                <Col xs={6} md={4}>
                <SessionSquare sampleImage={luke}
                surfSpot={spots[0]} 
                cfs={cfs[0]+' cfs'}
                weather={weather[0]}
                temp={this.kToF(temp[0])}
                />
                </Col>
                <Col xs={6} md={4}>
                <SessionSquare sampleImage={luke}
                surfSpot={spots[1]} 
                cfs={cfs[1]+' cfs'}
                weather={weather[1]}
                temp={this.kToF(temp[1])}
                />
                </Col>
                <Col xs={6} md={4}>
                <SessionSquare sampleImage={luke}
                surfSpot={spots[2]} 
                cfs={cfs[2]+' cfs'}
                weather={weather[2]}
                temp={this.kToF(temp[2])}
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
        <p>{props.weather+', '+props.temp}&#x2109;</p>
        </Thumbnail>
    );
}

class Contact extends React.Component {
    constructor() {
        super();
        this.state = {
            authenticated: false,
            posts: [],
        }
        this.listUpdate = this.listUpdate.bind(this);
    }

    listUpdate(newPost) {
        let myPosts = this.state.posts;
        myPosts.push(newPost);
        console.log('updated posts:');
        console.log(myPosts);
        this.setState({ posts : myPosts});
    }

    componentDidMount() {
        var myInitOne = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: this.props.username,
                password: this.props.password,
            }),
        };
        var myInitTwo = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        };
        fetch('/login',myInitOne).then((response) => {
            console.log('Contact verify response status: '+response.statusText);
            return response.json();
        }).then((data) => {
            if (data.authenticated == true) {
                this.setState({authenticated: true});
            }
        }).then(fetch('/posts',myInitTwo).then((response) => {
            console.log('FETCH POSTS CALLED'); 
            console.log('Posts get response status: '+response.statusText);
            return response.json();
        }).then((data) => {
            console.log(data);
            this.setState({ posts : data});
        }));
    }

    render() {
        let posts = this.state.posts;
        let username = this.props.username;
        if (this.state.authenticated == true) {
            const postList = posts.map((post) => {
                return (
                    <Panel header={post.username+'; '+post.date}>
                    {post.content}
                    </Panel>
                );
            });
            return (
                <div className="contactContainer">
                <div className="postsContainer">
                {postList}
                </div>
                <SuggestionForm username={username}
                update={this.listUpdate}
                />
                </div>
            );
        }
        else {
            return (
                <PleaseLogIn switchSignin={this.props.switchSignin}/>
            );
        }
    }
}

class SuggestionForm extends React.Component {
    constructor() {
        super();
        this.state = {
            content: '',
        }
        this.handleChange = this.handleChange.bind(this);
        this.handlePostSubmit = this.handlePostSubmit.bind(this);
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
                <Button bsStyle="primary" type="submit">
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

    handlePostSubmit(submit) {
        console.log('handlePostSubmit called');
        let now = new Date();
        let postDate = now.getHours()+':'+now.getMinutes()+' '+now.getMonth()+' '+now.getDay()+', '+now.getYear();
        var myInit = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: this.props.username,
                content : this.state.content,
                date    : postDate
            }),
        };
        fetch('/post',myInit).then((response) => {
            console.log('Sug. response status: '+response.statusText);
            return response.json();
        }).then((data) => {
            console.log('username: '+data.username);
            console.log('content: '+data.content);
            this.props.update(data);
        });
        submit.preventDefault();
    }

    handleChange(event) {
        this.setState({ content: event.target.value });
    }

    render() {
        const submitButton = this.generateSubmitButton();
        return (
            <Form onSubmit={this.handlePostSubmit}>
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
        Please <a onClick={props.switchSignin}>Log In</a>
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

    generateWelcome() {
        if (this.state.username != '') {
            return (
                <Panel>
                Welcome, {this.state.username}
                </Panel>
            );
        }
    }

    render() {
        const authenticated = this.state.authenticated;
        const view = this.state.currentView;
        const welcomePanel = this.generateWelcome();
            
        switch (view) {
            case 'grid':
                return (
                    <div className="appContainer">
                    <Navigator
                    homeActive={"true"}
                    switchGrid={() => this.switchGrid()}
                    switchContact={() => this.switchContact()}
                    switchSignin={() => this.switchSignin()}
                    />
                    <div className="welcomeContainer">
                    {welcomePanel}
                    </div>
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
                    <Contact switchSignin={() => this.switchSignin()}
                    username={this.state.username}
                    password={this.state.password}
                    />
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
                    homeActive={"true"}
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
