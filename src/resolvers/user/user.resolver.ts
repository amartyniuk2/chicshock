import { GqlAuthGuard } from '../../guards/gql-auth.guard';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UserEntity } from '../../decorators/user.decorator';
import {
  AllUsersResponse,
  UpdateUserReturn,
  User,
} from '../../models/user.model';
import { UserService } from 'src/services/user.service';
import { UpdateUserInput } from './dto/update.user.input';
import {
  CheckIfFollowExistsResponse,
  FollowUnFollowResponse,
} from 'src/models/followers.model';
import { handleError } from 'src/common/exceptions/exceptions';
import {
  CheckIfFriendExistsResponse,
  FriendshipReturn,
} from 'src/models/friends.model';
import { FriendshipInput } from './dto/friendship.input';
import { PaginationDto } from 'src/common/dto/pagination';

@Resolver(() => User)
@UseGuards(GqlAuthGuard)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(() => UpdateUserReturn)
  async me(@UserEntity() user: User) {
    try {
      const userProfile = await this.userService.fetchProfile(user.id);
      return {
        message: 'successfully fetched user profile',
        user: userProfile,
      };
    } catch (error) {
      handleError(error, 'failed to fetch user profile');
    }
  }

  @Query(() => UpdateUserReturn)
  async fetchProfile(@Args('userId') userId: string) {
    try {
      const userProfile = await this.userService.fetchProfile(userId);
      return {
        user: userProfile,
        message: 'successfully fetched user profile',
      };
    } catch (error) {
      handleError(error, 'failed to fetch user profile');
    }
  }

  @Query(() => AllUsersResponse)
  async fetchAllUsers(
    @Args({ name: 'pagination', defaultValue: {} }) pagination?: PaginationDto
  ) {
    try {
      const users: any[] = await this.userService.fetchAllUsers(pagination);
      return {
        users,
        message: 'successfully fetched all users',
      };
    } catch (error) {
      handleError(error, 'failed to fetch all users');
    }
  }

  @Mutation(() => FriendshipReturn)
  async addFriend(
    @UserEntity() user: User,
    @Args('friendId') friendId: string
  ) {
    try {
      const { isFriended, friendship: friendshipFromCheck } =
        await this.userService.checkIfFriendAlreadyAdded(user.id, friendId);

      if (isFriended) {
        return {
          friendship: friendshipFromCheck,
          message: 'already sent friend request to this user',
        };
      }
      const friendship = await this.userService.addFriend(user.id, friendId);

      return {
        friendship,
        message: 'successfully sent friend request',
      };
    } catch (error) {
      handleError(error, 'failed to send friend request');
    }
  }

  @Mutation(() => FriendshipReturn)
  async updateFriendRequest(
    @Args('friendshipId') friendshipId: string,
    @Args('data') data: FriendshipInput
  ) {
    try {
      const friendship = await this.userService.updateFriendshipInformation(
        friendshipId,
        data
      );
      return {
        friendship,
        message: 'successfully updated friend request',
      };
    } catch (error) {
      handleError(error, 'failed to update friend request');
    }
  }

  @Mutation(() => FriendshipReturn)
  async removeFriend(
    @UserEntity() user: User,
    @Args('friendId') friendId: string
  ) {
    try {
      const { isFriended, friendship: friendshipFromCheck } =
        await this.userService.checkIfFriendAlreadyAdded(user.id, friendId);

      if (!isFriended) {
        return {
          message:
            'you must be friends with this user to perform this operation',
        };
      }
      await this.userService.removeFriend(friendshipFromCheck.id);
      return {
        message: 'successfully removed friend',
      };
    } catch (error) {
      handleError(error, 'failed to remove friend');
    }
  }

  @Query(() => CheckIfFriendExistsResponse)
  async checkIfFriendAlreadyAdded(
    @UserEntity() user: User,
    @Args('userId') userId: string
  ) {
    try {
      const { isFriended, friendship } =
        await this.userService.checkIfFriendAlreadyAdded(user.id, userId);
      return {
        isFriended,
        friendship,
      };
    } catch (error) {
      handleError(error, 'failed to check for follow existance');
    }
  }

  @Query(() => CheckIfFollowExistsResponse)
  async checkIfFollowAlreadyExists(
    @UserEntity() user: User,
    @Args('userId') userId: string
  ) {
    try {
      const { follow, isFollowing } =
        await this.userService.checkIfFollowAlreadyExists(userId, user.id);
      return {
        isFollowExistant: isFollowing,
        follow,
      };
    } catch (error) {
      handleError(error, 'failed to check for follow existance');
    }
  }

  @Mutation(() => UpdateUserReturn)
  async updateUser(
    @UserEntity() user: User,
    @Args('data') data: UpdateUserInput
  ) {
    try {
      const userObject = await this.userService.updateUserInformation(
        user.id,
        data
      );
      return {
        message: 'successfully updated user information',
        user: userObject,
      };
    } catch (error) {
      handleError(error, 'failed to update user information');
    }
  }

  @Mutation(() => FollowUnFollowResponse)
  async followUser(@UserEntity() user: User, @Args('userId') userId: string) {
    try {
      const { isFollowing } = await this.userService.checkIfFollowAlreadyExists(
        userId,
        user.id
      );
      if (isFollowing) {
        return {
          message: 'you are already following this user',
        };
      }
      if (!isFollowing) {
        await this.userService.followUser(userId, user.id);
        return {
          message: 'successfully followed this user',
        };
      }
    } catch (error) {
      handleError(error, 'failed to follow this user');
    }
  }

  @Mutation(() => FollowUnFollowResponse)
  async unFollowUser(@UserEntity() user: User, @Args('userId') userId: string) {
    try {
      const { follow, isFollowing } =
        await this.userService.checkIfFollowAlreadyExists(userId, user.id);

      if (isFollowing) {
        await this.userService.unFollowUser(follow.id);
        return {
          message: 'successfully unfollowed this user',
        };
      }
      if (!isFollowing) {
        return {
          message: 'you are not following this user',
        };
      }
    } catch (error) {
      handleError(error, 'failed to follow this user');
    }
  }
}
