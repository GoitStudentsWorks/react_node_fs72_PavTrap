import { useEffect } from 'react';
import css from './DrinksSearch.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, fetchDrinks, fetchIngredients } from 'redux/Drinks/DrinksOperation';
import cssMainPage from "../../pages/MainPage/MainPage.module.css"
import Select from 'react-select';
import debounce from 'lodash.debounce';
import { selectStyles } from './selectStyles';
// import { useLocation, useNavigate } from 'react-router-dom';
import Dots from 'components/Spinner/Dots';
import { Paginator } from 'components/Paginator/Paginator';

const SearchSvg = ({ className }) => {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M9.16667 15.8333C12.8486 15.8333 15.8333 12.8486 15.8333 9.16667C15.8333 5.48477 12.8486 2.5 9.16667 2.5C5.48477 2.5 2.5 5.48477 2.5 9.16667C2.5 12.8486 5.48477 15.8333 9.16667 15.8333Z"
        stroke="#F3F3F3"
        stroke-width="1.8"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path d="M17.5 17.5L13.875 13.875" stroke="#F3F3F3" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  );
};


export const DrinksSearch = () => {
  const { categoryList, entities, ingredientList, isLoading, pages, lastRequest } = useSelector(state => state.drinks);
  const dispatch = useDispatch();
  // const navigate = useNavigate()
  // const location = useLocation();

 

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchIngredients());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  const debouncedHandleChange = debounce(payload => {
    dispatch(fetchDrinks({ word: payload }));
  }, 1000);

  const handleChange = event => {
    const payload = event.currentTarget.value;
    debouncedHandleChange(payload);
  };

  const handleChangeSelectCategory = selectedoption => {
    dispatch(fetchDrinks({ category: selectedoption.label }));
  };

  const handleChangeSelectIngredient = selectedoption => {
    dispatch(fetchDrinks({ ingredient: selectedoption.label }));
  };

  // const SelectList = ({ data }) => {
  //   const arr = [];
  //   data.forEach(elem => {
  //     arr.push(<option key={elem._id}>{elem.name || elem.title}</option>);
  //   });
  //   return arr;
  // };

  const changePage = (page) => {
    return fetchDrinks({page, lastRequest})
  }

  const selectListWithSelectReact = data => {
    const arr = [];
    let el = null;
    data.forEach(elem => {
      if (elem?.name) {
        el = elem.name;
      } else {
        el = elem.title;
      }
      arr.push({ value: el, label: el });
    });
    return arr;
  };

 

  // const navigateToRecipe = () => {
  //   const moveTo = location.pathname.replace(/\/[^/]+$/, '/recipe')
  //   console.log('moveTo', moveTo)
  //   navigate(moveTo)
  //   // navigate(`/recipe`)
  // }

  const DrinkCard = ({ drink, drinkThumb }) => (
    <li>
      <img src={drinkThumb} alt="drink" height={400} />
      <div className={cssMainPage.card_text_wrapper}>
        <p className={cssMainPage.card_name}>{drink}</p>
        <a className={cssMainPage.card_link} href='recipe'> 
          <p className={cssMainPage.ingredients_text}>ingredients</p>
        </a>
      </div>
    </li>
  );

  return (
    <>
      <form className={css.drinkRequestForm}>
        <div className={css.inputContainer}>
          <input onChange={handleChange} className={css.inputDrinks} placeholder="Enter the text" />
          <SearchSvg className={css.searchSvg} />
        </div>
        
      

        <Select
          placeholder="All categories"
          options={selectListWithSelectReact(categoryList)}
          styles={selectStyles}
          onChange={handleChangeSelectCategory}
        />
        <Select
          placeholder="Ingredients"
          options={selectListWithSelectReact(ingredientList)}
          styles={selectStyles}
          onChange={handleChangeSelectIngredient}
        />
      </form>
      {entities.data && (
        <ul className={css.mainPageList}>
          {entities.data.map(({ _id, drink, drinkThumb }) => (
            <DrinkCard key={_id} drink={drink} drinkThumb={drinkThumb} />
          ))}
        </ul>
      )}
      
      {isLoading && <Dots className={css.loading } />}
      {entities?.data?.length === 0 && isLoading === false && <h3>No result</h3>}
      
      {/* <Paginator pages={pages } onChangePage={ changePage} /> */}
      {entities?.data?.length > 10 && <Paginator pages={pages} onChangePage = {changePage} />}
    </>
  );
};
