package com.notebridge.backend.repository;

import com.notebridge.backend.entity.FileMetaData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface FilesRepo extends JpaRepository<FileMetaData, Long> {
    FileMetaData findByUniqueId(String uniqueId);
    @Transactional
    int deleteByUniqueId(String uniqueId);
}
