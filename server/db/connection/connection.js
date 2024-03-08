import express from "express";
import mongoose from "mongoose";

const Connection = async (url) => {
    try {
        const connection = await mongoose.connect(url);
        return connection;
    } catch (error) {
        console.log(error);
    }
}

export default Connection;