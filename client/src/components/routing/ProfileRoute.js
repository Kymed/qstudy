import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import AuthContext from '../../context/auth/authContext';
import ProfileContext from '../../context/profiles/profileContext';

const ProfileRoute = ({ component: Component, ...rest }) => {
    const authContext = useContext(AuthContext);
    const profileContext = useContext(ProfileContext);
    const { isAuthenticated } = authContext;
    const { profile_exists, loading } = profileContext;

    return (
        <Route
          {...rest}
          render={props =>
            !isAuthenticated ? (
              <Redirect to='/login' />
            ) : (loading ?
                    (<h2> Loading </h2>)
                :
                    (!profile_exists ?
                        (<Redirect to="/home" />)
                    :
                        (<Component {...props} />)
                    )
                )
          }
        />
      );
    
}

export default ProfileRoute;