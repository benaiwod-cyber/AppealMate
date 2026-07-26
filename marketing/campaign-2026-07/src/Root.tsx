import React from 'react';
import {Composition, Folder, Still} from 'remotion';
import {
  MultiToolSquare,
  ParkingSquare,
  ParkingStory,
  StepsPortrait,
} from './Stills';
import {MultiToolReel, ParkingReel} from './Videos';
import {
  CarouselHook,
  CarouselResult,
  CarouselTap,
  EditorialSquare,
  PhotoFeed,
  PhotoStory,
} from './AltStills';
import {PhotoKineticReel, TapThroughReel} from './AltVideos';

export const CampaignRoot: React.FC = () => {
  return (
    <>
      <Folder name="Static-Ads">
        <Still id="ParkingSquare" component={ParkingSquare} width={1080} height={1080} />
        <Still id="StepsPortrait" component={StepsPortrait} width={1080} height={1350} />
        <Still id="MultiToolSquare" component={MultiToolSquare} width={1080} height={1080} />
        <Still id="ParkingStory" component={ParkingStory} width={1080} height={1920} />
      </Folder>
      <Folder name="Short-Videos">
        <Composition
          id="ParkingReel"
          component={ParkingReel}
          width={1080}
          height={1920}
          fps={30}
          durationInFrames={360}
        />
        <Composition
          id="MultiToolReel"
          component={MultiToolReel}
          width={1080}
          height={1920}
          fps={30}
          durationInFrames={360}
        />
      </Folder>
      <Folder name="Alternative-Styles">
        <Still id="PhotoFeed" component={PhotoFeed} width={1080} height={1350} />
        <Still id="PhotoStory" component={PhotoStory} width={1080} height={1920} />
        <Still id="EditorialSquare" component={EditorialSquare} width={1080} height={1080} />
        <Still id="CarouselHook" component={CarouselHook} width={1080} height={1080} />
        <Still id="CarouselTap" component={CarouselTap} width={1080} height={1080} />
        <Still id="CarouselResult" component={CarouselResult} width={1080} height={1080} />
        <Composition id="TapThroughReel" component={TapThroughReel} width={1080} height={1920} fps={30} durationInFrames={300} />
        <Composition id="PhotoKineticReel" component={PhotoKineticReel} width={1080} height={1920} fps={30} durationInFrames={300} />
      </Folder>
    </>
  );
};
