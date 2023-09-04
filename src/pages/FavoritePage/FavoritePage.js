import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MainTitle } from 'components/MainTitle/MainTitle';
import { RecipesList } from 'components/RecipesList/RecipesList';
import { Paginator } from 'components/Paginator/Paginator';
import { NoRecipe } from 'components/NoRecipe/NoRecipe';
import { getFavoriteRecipes, getFavPage } from 'redux/FavoriteCocktails/FavoritesSelectors';
import { deleteFavorites, fetchFavorites } from 'redux/FavoriteCocktails/FavoritesOperation';
import { changeFavPage } from 'redux/FavoriteCocktails/FavoritesSlice';
import css from './FavoritePage.module.css';

export default function FavoritePage() {
  const favorites = useSelector(getFavoriteRecipes);
  const page = useSelector(getFavPage);
  const location = useLocation();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchFavorites(page));
  }, [dispatch, page]);

  return (
    <section className={css.favoritesContainer}>
      <MainTitle title="Favorites" />
      {favorites?.data?.length === 0 ? (
        <NoRecipe title="You haven't added any favorite cocktails yet" />
      ) : (
        <>
          <RecipesList recipes={favorites.data} state={{ from: location }} onDelete={deleteFavorites} />
          {favorites.count.totalPages > 1 && <Paginator pages={favorites.count} onChangePage={changeFavPage} />}
        </>
      )}
    </section>
  );
}
