import './App.css';
import Navigation from "./components/Navigation/Navigation";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import SignIn from "./components/SignIn/SignIn";
import Register from "./components/Register/Register";
import {Component} from "react";
import ParticlesBg from 'particles-bg'

const initialState = {
    input: '',
    imageURL: '',
    box: [],
    route: 'signIn',
    isSignedIn: false,
    user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
    }
}

class App extends Component{

    constructor() {
        super();
        this.state = initialState;
    }

    loadUser = (data) => {
        this.setState({
            user: {
                id: data.id,
                name: data.name,
                email: data.email,
                entries: data.entries,
                joined: data.joined
            }
        })
    }

    onInputChange = (event) => {
        this.setState({input: event.target.value})
    }

    processData = (data) => {
        let boxLocations = [];
        if(this.state.imageURL!==''){
            const image = document.getElementById('inputImage');
            const width = Number(image.width);
            const height = Number(image.height);
            if(data.regions){
                for (let i = 0; i < data.regions.length; i++) {
                    boxLocations.push(this.calculateFaceLocation(data.regions[i], width, height))
                }
            }
        }
        return boxLocations;
    }

    calculateFaceLocation = (data, width, height) => {
        const clarifaiFace = data.region_info.bounding_box;
        return{
            leftCol: clarifaiFace.left_col * width,
            topRow: clarifaiFace.top_row * height,
            rightCol: width - (clarifaiFace.right_col * width),
            bottomRow: height - (clarifaiFace.bottom_row * height)
        }
    }

    displayFaceBox = (box) => {
        this.setState({box: box})
    }

    onButtonSubmit = async () => {

        await this.setState({imageURL: this.state.input});
        fetch('https://whispering-hamlet-06157.herokuapp.com/imageURL', {
            method: 'post',
            headers: {"Content-type": "application/json"},
            body: JSON.stringify({
                imageURL: this.state.imageURL
            })
        })
            .then(response => response.json())
            .then(result => {
                console.log(result);
                if(result.regions) {
                    fetch("https://whispering-hamlet-06157.herokuapp.com/image", {
                        method: 'put',
                        headers: {"Content-type": "application/json"},
                        body: JSON.stringify({
                            id: this.state.user.id,
                            faces: result.regions.length
                        })
                    })
                        .then(result => result.json())
                        .then(count => {
                            this.setState(Object.assign(this.state.user, { entries: count }));
                        })
                        .catch(console.log);
                }
                this.displayFaceBox(this.processData(result))
            })
            .catch(error => console.log('error', error));

    }

    onRouteChange = (route) => {
        if (route === 'signOut'){
            this.setState(initialState);
        }else if (route === 'home'){
            this.setState({isSignedIn: true});
        }
        this.setState({route: route});
    }

    render(){
        const { isSignedIn, imageURL, route, box, user } = this.state;
        return (
            <>
                <div className="App">
                    <Logo />
                    <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>

                    {
                        this.state.route === 'home'
                            ? <>
                                <Rank name={user.name} entries={user.entries}/>
                                <ImageLinkForm
                                    onInputChange={this.onInputChange}
                                    onButtonSubmit={this.onButtonSubmit}
                                />
                                <FaceRecognition box={box} imageURL={imageURL}/>
                            </>
                            : (
                                route === 'register'
                                ? <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>
                                    : <SignIn onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>
                            )
                    }
                </div>
                <ParticlesBg type="cobweb" bg={true} />
            </>
        );
    }

}

export default App;
