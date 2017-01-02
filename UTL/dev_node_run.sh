#!/bin/bash

RtPth=`dirname $0`;

if [ $RtPth != '.' ]; then
  cd UTL;
fi;

npm run dev;
