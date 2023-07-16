import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Slider from 'react-slick'
import Cookies from 'js-cookie'
import {BsFilterLeft} from 'react-icons/bs'
import Header from '../Header'
import RestaurantItem from '../RestaurantItem'
import Footer from '../Footer'
import './index.css'

const sortByOptions = [
  {
    id: 0,
    displayText: 'Highest',
    value: 'Highest',
  },
  {
    id: 2,
    displayText: 'Lowest',
    value: 'Lowest',
  },
]

const carouselApiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const restaurantApiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}
class Home extends Component {
  state = {
    carouselApiStatus: carouselApiStatusConstants.initial,
    carouselData: [],
    restaurantsList: [],
    restaurantsApi: restaurantApiStatusConstants.initial,
    selectedSortByValue: sortByOptions[1].value,
  }

  componentDidMount() {
    this.getCarouselData()
    this.getRestaurantsList()
  }

  getCarouselData = async () => {
    this.setState({carouselApiStatus: carouselApiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    // console.log(jwtToken)
    const apiUrl = 'https://apis.ccbp.in/restaurants-list/offers'
    const options = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    // console.log(data)
    if (response.ok === true) {
      this.setState({
        carouselApiStatus: carouselApiStatusConstants.success,
        carouselData: data.offers,
      })
    }
  }

  getRestaurantsList = async () => {
    this.setState({restaurantsApi: restaurantApiStatusConstants.in_Progress})
    const token = Cookies.get('jwt_token')
    const LIMIT = 9
    // const offset = (currPage - 1) * LIMIT
    const url = `https://apis.ccbp.in/restaurants-list?limit=${LIMIT}`
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'GET',
    }
    const res = await fetch(url, options)
    const data = await res.json()
    if (res.ok === true) {
      const modifiedList = data.restaurants.map(e => ({
        id: e.id,
        costForTwo: e.cost_for_two,
        cuisine: e.cuisine,
        groupByTime: e.group_by_time,
        hasOnlineDelivery: e.has_online_delivery,
        hasTableBooking: e.has_table_booking,
        imageUrl: e.image_url,
        isDeliveringNow: e.is_delivering_now,
        location: e.location,
        menuType: e.menu_type,
        name: e.name,
        opensAt: e.opens_at,
        userRating: {
          rating: e.user_rating.rating,
          ratingColor: e.user_rating.rating_color,
          totalReviews: e.user_rating.total_reviews,
        },
      }))
      this.setState({
        restaurantsList: modifiedList,
        restaurantsApi: restaurantApiStatusConstants.success,
      })
    } else {
      this.setState({restaurantsApi: restaurantApiStatusConstants.failed})
    }
  }

  displayCarouselImages = () => {
    const {carouselData} = this.state
    //  console.log(carouselData)

    const settings = {
      dots: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      speed: 700,
      infinite: true,
      dotsClass: 'slick-dots',
      autoplay: true,
      autoplaySpeed: 3000,
      adaptiveHeight: true,
    }
    return (
      <div>
        <Slider {...settings}>
          {carouselData.map(each => (
            <img
              src={each.image_url}
              alt="offer"
              key="carousel-image"
              className="carousel-img"
            />
          ))}
        </Slider>
      </div>
    )
  }

  renderRestaurants = () => {
    const {restaurantsList} = this.state
    return (
      <ul className="restaurants-list">
        {restaurantsList.map(e => (
          <RestaurantItem data={e} key={e.id} />
        ))}
      </ul>
    )
  }

  changeTheSortByOptionValue = event => {
    this.setState(
      {selectedSortByValue: event.target.value},
      this.getAllRestaurantsData,
    )
  }

  carouselDisplayLoading = () => (
    <div data-testid="restaurants-offers-loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  onRenderDisplayCarousel = () => {
    const {carouselApiStatus} = this.state

    switch (carouselApiStatus) {
      case carouselApiStatusConstants.success:
        return this.displayCarouselImages()

      case carouselApiStatusConstants.inProgress:
        return this.carouselDisplayLoading()

      default:
        return null
    }
  }

  renderRestaurantsRespectiveView = () => {
    const {restaurantsApi} = this.state
    switch (restaurantsApi) {
      case restaurantApiStatusConstants.success:
        return this.renderRestaurants()
      case restaurantApiStatusConstants.in_Progress:
        return this.renderLoader()
      // case apiConstants.failed:
      //     return this.carouselsFailureView()

      default:
        return null
    }
  }

  renderLoader = () => {
    ;<div data-testid="restaurants-list-loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  }

  render() {
    const {selectedSortByValue} = this.state
    return (
      <div className="home-container">
        <Header />0
        <div className="carousel-box">
          {this.onRenderDisplayCarousel()}

          <div className="home-body">
            <h1 className="res-heading">Popular Restaurants</h1>
            <div className="caption-filter-box">
              <h3 className="caption">
                Select your favourite restaurant special dish and make your day
                happy...
              </h3>
              <div className="fliter-box">
                <BsFilterLeft />
                <p>Sort by</p>
                <select
                  id="sortBy"
                  onChange={this.changeTheSortByOptionValue}
                  value={selectedSortByValue}
                >
                  {sortByOptions.map(eachOption => (
                    <option key={eachOption.id}>
                      {eachOption.displayText}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <hr className="hr-rule" />
            <div className="restaurants-box">
              {this.renderRestaurantsRespectiveView()}
            </div>
          </div>
          <Footer />
        </div>
      </div>
    )
  }
}

export default Home
