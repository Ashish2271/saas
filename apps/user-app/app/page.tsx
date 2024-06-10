"use client";

import React, { useCallback, useEffect, useState } from "react";
import Navbar from "../components/header/Navbar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import axios from "axios";

function Example() {
  const newVideos = useCallback(async () => {
    axios.get("http://localhost:3001/api/videos/test").then((response) => {
      console.log(response.data);
    });
  }, []);

  return (
    <div>
      
      <main className="p-6 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/valorant">
            <Card className="bg-gray-800" style={{ width: 240, height: 390 }}>
              <CardMedia
                component="img"
                height="60"
                image="https://trackercdn.com/cdn/tracker.gg/boxart/valorant.jpg"
                alt="View Clips"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  View Clips
                </Typography>
              </CardContent>
            </Card>
          </Link>
          <div className="space-y-6">
            <Link href="/training">
              <Card className="bg-gray-800">
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    Aim Training 
                  </Typography>
                </CardContent>
              </Card>
            </Link>
           
          </div>
        </div>
      </main>
    </div>
  );
}

export default Example;
