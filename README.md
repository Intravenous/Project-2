### ![GA](https://cloud.githubusercontent.com/assets/40461/8183776/469f976e-1432-11e5-8199-6ac91363302b.png) General Assembly, Software Engineering Immersive

---

## Soundtrack

## Overview

Soundtrack, your birthday playlist through the years, was the second project undertaken on my immersive course. The goal was to create a multi-page React app, within a 48-hour time period, that incorporated a public API. The project was undertaken as a pair, with the stipulation that only one computer was to be used.

Essentially, Soundtrack enabled a user to input their birthdate and then receive a birthday playlist.  This playlist consisted of records that had been at No.1 in the UK singles chart, for every birthday since the year of their birth.

The project was an opportunity for my partner and I, to implement what we had learnt to date, with a particular focus on React and integrating public APIs into our applications.

The finished product can be found [here](https://intravenous.github.io/Project-2/).

---

## The Brief 

* **Consume a public API** – this could be anything but it must make sense for your project.
* **Have several components** - At least one classical and one functional.
* **The app should include a router** - with several "pages".
* **Include wireframes** - that you designed before building the app.
* Have **semantically clean HTML** - you make sure you write HTML that makes structural sense rather than thinking about how it might look, which is the job of CSS.
* **Be deployed online** and accessible to the public.

---

## The Technologies Used 

- React.js
- Bulma
- CSS3
- JSON
- Moment (library)
- Babel
- Webpack
- Git and GitHub

---

## The Approach 

`The API and App.js`

After brainstorming ideas and searching for a suitable API, as a pair we eventually settled on the idea of creating an application that would provide the ‘Soundtrack’ to a user’s life using Deezer’s API.

On completion of the project, our application composed of four pages and eight components.

```js
const App = () => (
  <BrowserRouter basename='/Project-2'>
    <NavBar />
    <Switch>
      <Route exact path='/' component={Home}/>
      <Route exact path='/search' component={SearchPage} />
      <Route exact path='/birthday' component={Birthday} />
      <Route exact path='/playlist' component={Playlist} />
      <Route />
    </Switch>
  </BrowserRouter>
)

```


`Home`

Stylistically we decided upon a very simple hero home page that both announced what the application did and provided links for the applications two functions.

* Search - enabled a user to search Deezer by artist or track.
* Birthday Playlist - enabled a user to enter their birthdate and receive a playlist.

 
<img  src=images/project-2-Home.png height=500> 

`Search`

The Search page took advantage of the general search endpoint provided by the Deezer API. We created a number of components, that combined, searched Deezer based on the artist or song provided by the user.  A results page would then display the results and allow a snippet of the track to be played.

 <img  src=images/project-2-search.png height=500> 

`SearchBar.js`

The SearchBar was a functional component created to capture the input as entered by the user.

* handleChange – Captured the input as entered by the user into the search bar.
* handleSubmit – Dealt with the action of passing the information to the SearchPage, when a user clicked the Search button.

```js
const SearchBar = ({ handleChange, handleSubmit }) => {
  return (
    <div className="Search">
      <div className="container">
        <h1 className="title is-1 has-text-centered">Search...</h1>
        <div className="field is-horizontal has-addons">
          <div className="field-body">
            <div className="control is-expanded"></div>
            <input
              className="input is-medium"
              type="search"
              placeholder="Search by artist or track"
              onChange={handleChange}
            />
          </div>
          <div className="control">
            <button onClick={handleSubmit} className="button is-primary is-medium">Search</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchBar

```


`SearchPage.js`

SearchPage was a classical component that took the query string from the searchBar and utilised the general search endpoint provided by the Deezer API.  Our search was limited to returning 24 results.

```js
  constructor() {
    super()
    this.state = {
      query: '',
      data: []
    }
  }

  handleChange(event) {
    const searchQuery = event.target.value
    this.setState({ query: searchQuery })
  }

  handleSubmit(event) {
    event.preventDefault()
    const { query } = this.state
    axios.get(`https://cors-anywhere.herokuapp.com/https://api.deezer.com/search?q="${query}"&limit=24`)
      .then(res => {
        this.setState({ data: res.data.data })
      })
      .catch(err => console.error(err))
  }

```

* Two different states were set:
  * An empty string to handle the user entry.
  * An empty array to handle the results returned from Deezer.
* handleChange – Set the state of ‘query’ to the value of the variable searchQuery. SearchQuery was populated via the event target value of the search bar.
* Query was then incorporated in an axios get request to Deezer using a temperate literal.
* The result (res) were then used to set the state of data, which was initialised as an empty array.
* Data was then passed to the results component to enable rendering to the page. 

```js
render() {
    const { value, data } = this.state
    return (
      <section className="Hero hero is-fullheight">
        <div className="hero-body">
          <div className="container">
          
            <SearchBar value={value} handleSubmit={(event) => this.handleSubmit(event)} handleChange={(event) => this.handleChange(event)} />
            <Results data={data} />
          </div>
        </div>
      </section>
    )
  }
}

```


`Birthday Playlist`

The Birthday Playlist page, had a set of three input boxes, that took a user’s birthdate and via a number of different components, produced a Birthday playlist.

  <img  src=images/project-2-birthdayplaylist.png height=500> 


`Birthday.js`

Birthday.js was the main classical component created for the birthday playlist functionality.  It consisted of three states; birthdayInput, birthdayArray and data. BirthdayInput was an object consisting of three strings, representing the constituent parts of a birthdate; day, month and year.

```js

  handleChange(event) {
    console.log(event)
    const { name, value } = event.target
    const data = { ...this.state.birthdayInput, [name]: value }
    this.setState({ birthdayInput: data })
  }

  handleSubmit(event) {
    const { date, month, year } = this.state.birthdayInput
    event.preventDefault()
    const bdays = scripts.getBirthdays(year, month, date)
    const bdayArray = Array.from(bdays)
    const searchSongs = findNumberOnes(bdayArray)
    console.log(searchSongs)

    const dataUpdate = []

    const promises = []

    for (let i = 0; i < searchSongs.length; i++) {
      promises.push(axios.get(`https://cors-anywhere.herokuapp.com/https://api.deezer.com/search?q=artist:"${searchSongs[i]['artist']}" track:"${searchSongs[i]['track']}"&limit=1`)
        .then(res => {
          return res.data.data[0]
        })
        .catch(err => console.error(err)))
    }
    
    Promise.all(promises)
      .then((results) => {
        this.setState({ data: results, birthdayArray: searchSongs })
        this.props.history.push('/playlist', { data: results, birthdayArray: searchSongs }  )
      })    
  }
```
* handleChange – 
  * Set state of birthdayInput, by capturing the event of the three input fields and then used spread to set the value of the three strings in the object.
* handleSubmit – 
  * Deconstructed the bithdayInput object.
  * Set the value of the variable bdays, to the result of the function getBirthdays, in the scripts component.
  * The result of the function is then used to create a new array called bdayArray.
  * bdayArray is then passed to the findNumberOnes function, which using a library called moment, creates a list of artists and tracks, stored in the variable searchSongs.
  * searchSongs is then sent in a series of axios get requests, using a for loop and Deezer returns the list of songs.
  * Finally, the results are used to set the state of data and searchSongs sets the state of birthdayArray. The results are then rendered via the playlist component.

<img  src=images/project-2-birthdayresults.png height=500> 

 ---

## Challenges

* Interpreting documentation of different APIs, was also a challenge.  I think we discovered that not all documentation is written equal, and sometimes working out how to use an API wasn’t always easy. 
* Finally, although maybe not so much a coding challenge as such, but getting the number one data into a usable format to use in the code, wasn’t as easy as one would have hoped. Thankfully Excel and some brute force helped remedy this issue.

---

## Successes

* The logic required to select a song for birthday, if the number one record for that date was one that spanned a number of weeks.  Thankfully, my partner was able to figure out a way of using a library called moment that worked out this particular issue.
* Finding an API that enabled us to crate the application that we wanted to create.  After a few false starts, we were able to find a suitable API and work with the documentation provided.

---

## Potential Future Features

* Adding an export function that allowed a user to export their playlist in an xml format.  This would then allow a user to upload their playlist to a music service of their choice, i.e. Spotify.
* Given more time, I think we would also have liked to have developed the look and feel of the site further. 

---

## Lessons Learned

* That having to rely on a third-party API for the main functionality of your application leaves you open to any limitations regarding the quality of the data they provide. As a result, you may find you have to change tack from what you originally planned to do or find novel way around any given limitation.
