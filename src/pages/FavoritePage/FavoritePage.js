import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MainTitle } from 'components/MainTitle/MainTitle';
import { RecipesList } from 'components/RecipesList/RecipesList';
import { Paginator } from 'components/Paginator/Paginator';
import { getFavoriteRecipes,getFavPage } from 'redux/FavoriteCocktails/FavoritesSelectors';
import { deleteFavorites, fetchFavorites } from 'redux/FavoriteCocktails/FavoritesOperation';
import { changeFavPage } from 'redux/FavoriteCocktails/FavoritesSlice';

export default function FavoritePage() {
  const favorites = useSelector(getFavoriteRecipes);
  const page = useSelector(getFavPage);
  const location = useLocation();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchFavorites(page));
  }, [dispatch, page]);
  return (
    <>
      <MainTitle title="Favorites" />
      {favorites.length !== 0 && (
        <>
          <RecipesList recipes={favorites.data} state={{ from: location }} onDelete={deleteFavorites}/>
          {favorites.count.totalPages>1 && <Paginator pages={favorites.count} onChangePage={changeFavPage}/>}
        </>
      )}
    </>
  );
}
